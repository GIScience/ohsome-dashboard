import { AfterViewInit, Component, ElementRef, forwardRef, Input, NgZone, OnChanges, SimpleChanges, inject } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as L from 'leaflet';
import {LatLngBounds, Layer, LayerOptions, LeafletEvent, LeafletMouseEvent, PM} from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import {OhsomeApi} from '@giscience/ohsome-js-utils';
import mask from '@turf/mask';
import {BoundaryInputComponentInteractionType, BoundaryInputComponentOptions, Userlayer} from '../../shared-types';
import OhsomeApiRequest = OhsomeApi.v1.request;
import area from '@turf/area';

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
    ],
    standalone: false
})

export class BoundaryInputComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  private elRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);


  @Input('interactionType')
  get interactionType(): BoundaryInputComponentInteractionType {
    return this._interactionType;
  }

  set interactionType(value: BoundaryInputComponentInteractionType) {
    this._interactionType = value;
    if (this.map) {
      this.setInputType(value);
    }
  }


  @Input('options')
  get options(): BoundaryInputComponentOptions {
    return this._options;
  }

  set options(newOptions) {
    this._options = {...this._options, ...newOptions};
  }


  private defaultOptions: BoundaryInputComponentOptions = {
    label: false,
    center: {lat: 49.4185, lng: 8.6755},
    zoom: 13,
    maskPoly: undefined,
    maxBounds: undefined,
    minZoom: undefined,
    maxZoom: undefined,
    userDefinedPolygonLayers: []
  };
  private _value = ''; // Input value which is used by ngModel
  private _interactionType: BoundaryInputComponentInteractionType = 'bbox';
  private _options: BoundaryInputComponentOptions = this.defaultOptions;

  //groups to manage different boundary geometry types
  private bboxLayersGroup = L.layerGroup();
  private bcircleLayersGroup = L.layerGroup();
  private bpolyLayersGroup = L.layerGroup();
  private boundaryLayersGroup = L.layerGroup([this.bboxLayersGroup, this.bcircleLayersGroup, this.bpolyLayersGroup]);

  //group for user defined layers
  private userDefinedLayersGroup = L.layerGroup();

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
    dragMode: false,
    removalMode: true,
    rotateMode: false
  };

  private isListeningToPmRemove = false;

  public map: L.Map;

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initMap(this.interactionType);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    const userLayers = changes["options"].currentValue.userDefinedPolygonLayers
    console.log("userLayers", userLayers)
    this.addOrUpdateUserDefinedLayers(userLayers);

  }

  // ControlValueAccesor methods
  // write value to this component (map)
  writeValue(val: string): void {
    this.value = val || '';
  }

  propagateChange = (_: any) => {
    console.log('propagateChange', _);
  };

  // register a callback that is expected to be triggered every time the value changes from the map
  registerOnChange(fn: any): void {
    console.log('registerOnChange', fn);
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @Input() disabled = false;

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.updateMapFromValue(val);
  }

  // @param value is a text representation of a boundary value (bboxes=... or bcircles=... or bpolys=...
  private updateMapFromValue(value) {

    // remove all layer and add them again
    this.listenToRemove(false);

    this.bboxLayersGroup.clearLayers();
    this.bcircleLayersGroup.clearLayers();
    this.bpolyLayersGroup.clearLayers();

    this.listenToRemove(true);

    // collect bound for automatic zoom here while parsing inputs
    let commonBounds: LatLngBounds | null = null;

    if (this.interactionType == 'bbox') {
      const bboxes = new OhsomeApiRequest.Bboxes().parse(value);
      bboxes.boundaries.forEach(bbox => {
        const geom = bbox.geometry;
        const coords = geom.split(',').map(coord => parseFloat(coord));
        const bounds = [[coords[1], coords[0]], [coords[3], coords[2]]];
        const rect = L.rectangle(bounds as L.LatLngBoundsExpression, {bubblingMouseEvents: false} as L.PathOptions).addTo(this.bboxLayersGroup)
          .on('pm:edit', this.updateValueFromMap, this)
          .on('click', () => {
            if (!this.map.pm.globalRemovalModeEnabled()) {
              this.map.pm.enableGlobalEditMode();
            }
          })
        ;
        commonBounds = (commonBounds) ? commonBounds.extend(rect.getBounds()) : new LatLngBounds(rect.getBounds().getSouthEast(), rect.getBounds().getNorthWest());
      });
    } else if (this.interactionType == 'bcircle') {
      const bcircles = new OhsomeApiRequest.Bcircles().parse(value);
      bcircles.boundaries.forEach(bcircle => {
        console.log('updateMapFromValue::bcircle', bcircle.geometry, bcircle.lng, bcircle.lat, bcircle.radius);
        const cirle = L.circle([bcircle.lat, bcircle.lng], {
          radius: bcircle.radius,
          bubblingMouseEvents: false
        } as L.CircleOptions).addTo(this.bcircleLayersGroup)
          .on('pm:edit', this.updateValueFromMap, this)
          .on('click', () => {
            if (!this.map.pm.globalRemovalModeEnabled()) {
              this.map.pm.enableGlobalEditMode();
            }
          })
        ;
        commonBounds = (commonBounds) ? commonBounds.extend(cirle.getBounds()) : new LatLngBounds(cirle.getBounds().getSouthEast(), cirle.getBounds().getNorthWest());
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
        const polygon = L.polygon(latLngs, {bubblingMouseEvents: false} as L.PathOptions).addTo(this.bpolyLayersGroup)
          .on('pm:edit', this.updateValueFromMap, this)
          .on('click', () => {
            if (!this.map.pm.globalRemovalModeEnabled()) {
              this.map.pm.enableGlobalEditMode();
            }
          })
        ;
        commonBounds = (commonBounds) ? commonBounds.extend(polygon.getBounds()) : new LatLngBounds(polygon.getBounds().getSouthEast(), polygon.getBounds().getNorthWest());
      });
    }

    // trigger auto zoom to features
    if (commonBounds != null) {
      this.map.flyToBounds(commonBounds, {padding: [20, 20]});
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
      if (layer instanceof L.Rectangle) {
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

        _value.push(coords.join(','));

      }
    });
    // update ngModel through ControlValueAccessor
    this.propagateChange(_value.join('|'));
  }

  private initMap(interactionType: string): void {
    //theMap
    const mapDiv = this.elRef.nativeElement.querySelector('#boundaryMap');

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

        // if extent is whole planet or bigger don't add the maskLayer
        if (area(maskedPoly) > 0) {
          const maskLayer = L.geoJSON(maskedPoly, {
            // pmIgnore: true,
            interactive: false,
            style: {color: '#000', stroke: false}
          } as LayerOptions);
          maskLayer.addTo(this.map);
        }
      } catch (e) {
        throw new Error('Could not create maskLayer from: ' + JSON.stringify(this.options.maskPoly));
      }
    }

    //add user defined GeoJSON layers
    if (this.options.userDefinedPolygonLayers) {
      try {

        this.addOrUpdateUserDefinedLayers(this.options.userDefinedPolygonLayers);
        this.userDefinedLayersGroup.addTo(this.map);
      } catch (e) {
        throw new Error('Could not create user-defined layer from: ' + JSON.stringify(e));
      }
    }


    // group layer for boundaries
    this.boundaryLayersGroup.addTo(this.map);

    this.setInputType(interactionType);

//{ shape: PM.SUPPORTED_SHAPES } & LayersControlEvent
    this.map.on('pm:create', (e: PMLeafletEvent) => {
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

  private addOrUpdateUserDefinedLayers(userDefinedLayers: Userlayer[] | undefined) {

    this.userDefinedLayersGroup.clearLayers();

    userDefinedLayers?.forEach(userlayer => {
      const layer = L.geoJSON(userlayer.data, {
        pmIgnore: true,
        interactive: false,
        style: userlayer.style
      });
      layer.addTo(this.userDefinedLayersGroup);
    })
  }

  onPmRemove(e) {
    const layer = e.layer as Layer;
    if (layer instanceof L.Rectangle) {
      this.bboxLayersGroup.removeLayer(<Layer>layer);
    } else if (layer instanceof L.Circle) {
      this.bcircleLayersGroup.removeLayer(<Layer>layer);
    } else if (layer instanceof L.Polygon) {
      this.bpolyLayersGroup.removeLayer(<Layer>layer);
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
        //TODO set cutPolygon to true when bpolys format changes to WKT or GeoJSON, but currently holes are not supported
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

  removeAllBoundaries(): void {
    this.bboxLayersGroup.clearLayers();
    this.bcircleLayersGroup.clearLayers();
    this.bpolyLayersGroup.clearLayers();

    this.updateValueFromMap();
  }
}

export interface PmOptions extends L.LayerOptions {
  pmIgnore?: boolean;
}

interface PMLeafletEvent extends LeafletEvent {
  shape?: PM.SUPPORTED_SHAPES
}


