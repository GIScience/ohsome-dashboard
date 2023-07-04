import {AfterViewInit, Component, ElementRef, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as L from 'leaflet';
import {LeafletMouseEvent, PM} from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import {OhsomeApi} from '@giscience/ohsome-js-utils';
import {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import mask from '@turf/mask';
import OhsomeApiRequest = OhsomeApi.v1.request;

@Component({
  selector: 'app-boundary-input',
  templateUrl: './boundary-input.component.html',
  styleUrls: ['./boundary-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BoundaryInputComponent),
      multi: true
    }
  ]
})

export class BoundaryInputComponent implements ControlValueAccessor, AfterViewInit {


  private defaultOptions: BoundaryInputComponentOptions = {
    type: 'bbox',
    label: false,
    center: {lat: 49.4185, lng: 8.6755},
    zoom: 13,
    maskPoly: undefined,
    maxBounds: undefined,
    minZoom: undefined,
    maxZoom: undefined
  };
  private _value = ''; // Input value which is used by ngModel
  private _options: BoundaryInputComponentOptions = this.defaultOptions;

  //groups to manage different boundary geometry types
  private bboxLayersGroup = L.layerGroup();
  private bcircleLayersGroup = L.layerGroup();
  private bpolyLayersGroup = L.layerGroup();
  private boundaryLayersGroup = L.layerGroup([this.bboxLayersGroup, this.bcircleLayersGroup, this.bpolyLayersGroup]);

  // base options for leaflet.pm plugin to be changed as needed
  private pmBaseOptions = {
    position: 'topleft',
    drawMarker: false, // adds button to draw markers
    drawPolyline: false, // adds button to draw a polyline
    drawRectangle: false, // adds button to draw a rectangle
    drawPolygon: false, // adds button to draw a polygon
    drawCircle: false, // adds button to draw a cricle
    drawCircleMarker: false,
    drawText: false,
    cutPolygon: false, // adds button to cut a hole in a polygon
    editMode: true, // edit mode can be enabled on individual features by click and disabled by clickout on map
    removalMode: true,
    rotateMode: false
  };

  private isListeningToPmRemove = false;

  public map: L.Map;

  constructor(private elRef: ElementRef) {
    //Object.assign(this._options, this.defaultOptions);
    console.log('constructor', this.options);
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.initMap(this.options.type);
  }

  // ControlValueAccesor methods
  // write value to to this component (map)
  writeValue(val: string): void {
    console.log('CVA::writeValue');
    this.value = val || '';
  }

  propagateChange = (_: any) => {
    console.log('propagateChange', _);
  };

  // register a callback that is expected to be triggered every time the value changes from the map
  registerOnChange(fn: any): void {
    console.log('registerOnChange', fn);
    this.propagateChange = fn;
    // throw new Error("Method not implemented.");
  }

  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @Input() disabled = false;


  get value(): string {
    console.log('GET: value');
    return this._value;
  }

  set value(val: string) {
    console.log('SET: value', val);
    this._value = val;
    this.updateMapFromValue(val);
  }

  @Input('options')
  get options(): BoundaryInputComponentOptions {
    return this._options;
  }

  set options(obj) {
    console.log('set options');
    Object.assign(this._options, obj);

    // this._options = obj;
    if (this.map) {
      this.setInputType(obj.type);
    }
  }

  // @param value is a text representation of a boundary value (bboxes=... or bcircles=... or bpolys=...
  private updateMapFromValue(value) {
    console.log('Map <- Value');

    // remove all layer and add them again
    this.listenToRemove(false);

    this.bboxLayersGroup.clearLayers();
    this.bcircleLayersGroup.clearLayers();
    this.bpolyLayersGroup.clearLayers();

    this.listenToRemove(true);


    if (this.options.type == 'bbox') {
      const bboxes = new OhsomeApiRequest.Bboxes().parse(value);
      bboxes.boundaries.forEach(bbox => {
        console.log('updateMapFromValue::bbox', bbox.toString());
        const geom = bbox.geometry;
        const coords = geom.split(',').map(coord => parseFloat(coord));
        const bounds = [[coords[1], coords[0]], [coords[3], coords[2]]];
        L.rectangle(bounds as L.LatLngBoundsExpression, {bubblingMouseEvents: false} as L.PathOptions).addTo(this.bboxLayersGroup)
          .on('pm:edit', this.updateValueFromMap, this)
          .on('click', (e) => {
            if (!this.map.pm.globalRemovalModeEnabled()) {
              this.map.pm.enableGlobalEditMode();
            }
          })
        ;
      });
    } else if (this.options.type == 'bcircle') {
      const bcircles = new OhsomeApiRequest.Bcircles().parse(value);
      bcircles.boundaries.forEach(bcircle => {
        console.log('updateMapFromValue::bcircle', bcircle.geometry, bcircle.lng, bcircle.lat, bcircle.radius);
        L.circle([bcircle.lat, bcircle.lng], {
          radius: bcircle.radius,
          bubblingMouseEvents: false
        } as L.PathOptions).addTo(this.bcircleLayersGroup)
          .on('pm:edit', this.updateValueFromMap, this)
          .on('click', (e) => {
            if (!this.map.pm.globalRemovalModeEnabled()) {
              this.map.pm.enableGlobalEditMode();
            }
          })
        ;
      });
    } else /*if (this.options.type == "bpoly")*/ {
      const bpolys = new OhsomeApiRequest.Bpolys().parse(value);
      bpolys.boundaries.forEach(bpoly => {
        console.log('updateMapFromValue::bpoly', bpoly.geometry);
        const geom = bpoly.geometry;
        const coords = geom.split(',').map(parseFloat);
        const latLngs: L.LatLng[] = [];

        const lastCoordIndex = coords.length - 3;
        for (let i = 0; i < lastCoordIndex; i = i + 2) {
          latLngs.push(L.latLng(coords[i + 1], coords[i]));
        }
        L.polygon(latLngs, {bubblingMouseEvents: false} as L.PathOptions).addTo(this.bpolyLayersGroup)
          .on('pm:edit', this.updateValueFromMap, this)
          .on('click', (e) => {
            if (!this.map.pm.globalRemovalModeEnabled()) {
              this.map.pm.enableGlobalEditMode();
            }
          })
        ;
      });
    }

    // reregister recreated layers if removal mode or edit mode is on
    if (this.map.pm.globalRemovalModeEnabled()) {
      this.map.pm.toggleGlobalRemovalMode();
      this.map.pm.toggleGlobalRemovalMode();
    }

    if (this.map.pm.globalEditModeEnabled()) {
      this.map.pm.toggleGlobalEditMode();
      this.map.pm.toggleGlobalEditMode();
    }
  }


  private updateValueFromMap() {

    const _value: string[] = [];

    this.bboxLayersGroup.eachLayer((layer) => {
      console.log('VALUE <- MAP: # bbox in group', layer);
      if (layer instanceof L.Rectangle) {
        console.log('RECTANGLE');
        _value.push(layer.getBounds().toBBoxString()
          .split(',')
          .map(coord => parseFloat(parseFloat(coord).toFixed(7)))
          .join(','));
      }
    });

    this.bcircleLayersGroup.eachLayer((layer) => {
      if (layer instanceof L.Circle) {
        const latLng = layer.getLatLng();
        const radius = layer.getRadius();
        _value.push(parseFloat(latLng.lng.toFixed(7)) + ',' + parseFloat(latLng.lat.toFixed(7)) + ',' + parseFloat(radius.toFixed(7)));
      }
    });

    this.bpolyLayersGroup.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        // in case of nested polygon or multipolygon array find first array that contains coordinares and ignore the rest
        let latLngs = layer.getLatLngs();
        while (latLngs[0] instanceof Array) {
          latLngs = latLngs[0] as L.LatLng[] | L.LatLng[][];
        }
        console.log('flat latlngs', latLngs);
        // flatten array, flip coords and duplicate last point
        let coords: number[] = [];
        latLngs = latLngs as L.LatLng[];
        latLngs.forEach(latLng => {
          coords.push(latLng.lng);
          coords.push(latLng.lat);
        });
        coords.push(coords[0]);
        coords.push(coords[1]);

        coords = coords.map((coord) => parseFloat(coord.toFixed(7)));
        console.log('bpoly coords', coords);

        _value.push(coords.join(','));

      }
    });
    // update ngModel through ControlValueAccessor
    this.propagateChange(_value.join('|'));  // (this.value);
  }


  private initMap(type: string): void {
    //theMap
    const mapDiv = this.elRef.nativeElement.querySelector('#boundaryMap');

    console.log('initMap', this.options);
    this.map = L.map(mapDiv, {
      maxBounds: this.options.maxBounds,
      minZoom: this.options.minZoom,
      maxZoom: this.options.maxZoom
    }).setView(this.options.center, this.options.zoom);

    //OSM Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      noWrap: true,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // add mask layer
    if (this.options.maskPoly) {
      try {
        const maskedPoly = mask(this.options.maskPoly);
        const maskLayer = L.geoJSON(maskedPoly, {
          pmIgnore: true,
          interactive: false,
          style: {color: '#000', stroke: false}
        } as PmOptions);
        maskLayer.addTo(this.map);
      } catch (e) {
        throw new Error('Could not create maskLayer from: ' + JSON.stringify(this.options.maskPoly));
      }
    }


    // group layer for boundaries
    this.boundaryLayersGroup.addTo(this.map);

    this.setInputType(type);


    this.map.on('pm:create', (e: { shape: PM.SUPPORTED_SHAPES, layer: L.Layer }) => {
      const layer = e.layer;
      const shape = e.shape;

      switch (shape) {
        case 'Rectangle': {
          layer.remove().addTo(this.bboxLayersGroup);
          break;
        }
        case 'Circle': {
          layer.remove().addTo(this.bcircleLayersGroup);
          break;
        }
        case 'Polygon': {
          layer.remove().addTo(this.bpolyLayersGroup);
          break;
        }
        default: {
          throw new Error(`${shape} is currently not supported by boundary-input-component`);
        }
      }
      //update components value
      console.log('pm:create', e);
      // e.layer.on('pm:edit', this.updateValueFromMap(),this);
      this.updateValueFromMap();
    }, this);


    this.map.on('click', (e: LeafletMouseEvent) => {
      // disable edit by clickout (click on map div with id boundaryMap and not on any feature on the map)
      const clickEvent = e.originalEvent as MouseEvent & { target?: HTMLDivElement };
      if (clickEvent.target?.id == 'boundaryMap'
        &&
        (
          this.map.pm.globalEditModeEnabled()
          ||
          this.map.pm.globalRotateModeEnabled()
        )) {
        this.map.pm.disableGlobalEditMode();
        this.map.pm.disableGlobalRotateMode();
      }
    });

    this.listenToRemove(true);

  }

  onPmRemove(e) {
    console.log('onPmRemove', e);
    const layer = e.layer;
    if (layer instanceof L.Rectangle) {
      this.bboxLayersGroup.removeLayer(layer);
    } else if (layer instanceof L.Circle) {
      this.bcircleLayersGroup.removeLayer(layer);
    } else if (layer instanceof L.Polygon) {
      this.bpolyLayersGroup.removeLayer(layer);
    }

    this.updateValueFromMap();
  }

  listenToRemove(doListen: boolean) {

    if (this.isListeningToPmRemove == doListen) {
      return;
    } else if (doListen) {
      this.isListeningToPmRemove = true;
      this.map.on('pm:remove', this.onPmRemove, this);
    } else {
      this.isListeningToPmRemove = false;
      this.map.off('pm:remove', this.onPmRemove, this);
    }


  }

  setInputType(type: string) {
    const pmOptions = {};
    switch (type) {
      case 'bbox': {
        Object.assign(pmOptions, this.pmBaseOptions, {drawRectangle: true});
        this.map.pm.enableDraw('Rectangle');
        break;
      }
      case 'bcircle': {
        Object.assign(pmOptions, this.pmBaseOptions, {drawCircle: true});
        this.map.pm.enableDraw('Circle');
        break;
      }
      case 'bpoly': {
        //TODO set cutPolygon to true when bpolys format changres to WKT or GeoJSON, but currently holes are not supported
        Object.assign(pmOptions, this.pmBaseOptions, {drawPolygon: true, rotateMode: true, cutPolygon: false});
        this.map.pm.enableDraw('Polygon');
        break;
      }
      default: {
        throw new Error(`${type} is not supported as type of <app-boundary-input> component`);
      }
    }

    this.map.pm.addControls(pmOptions);

  }

}

export interface BoundaryInputComponentOptions {
  type: 'bbox' | 'bcircle' | 'bpoly';
  label?: string | boolean;
  center: L.LatLngExpression;
  zoom: number;
  maxBounds?: L.LatLngBoundsExpression;
  minZoom?: number;
  maxZoom?: number;
  maskPoly?: Polygon | MultiPolygon | Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>;
}

export interface PmOptions extends L.LayerOptions {
  pmIgnore?: boolean;
}
