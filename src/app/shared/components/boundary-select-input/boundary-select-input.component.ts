import {Component, ElementRef, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as L from 'leaflet';
import {LatLngBoundsExpression, LatLngExpression, LayerOptions, LeafletEvent} from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import {wmsSelect} from './Leaflet.TileLayer.WmsSelect';
import {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import mask from '@turf/mask';
import area from '@turf/area';

@Component({
  selector: 'app-boundary-select-input',
  templateUrl: './boundary-select-input.component.html',
  styleUrls: ['./boundary-select-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BoundarySelectInputComponent),
      multi: true
    }
  ]
})

export class BoundarySelectInputComponent implements ControlValueAccessor, OnInit {

  private defaultOptions: BoundarySelectInputComponentOptions = {
    type: 'bpoly',
    label: false,
    center: {lat: 49.4185, lng: 8.6755},
    zoom: 13,
    maskPoly: undefined,
    maxBounds: undefined,
    minZoom: undefined,
    maxZoom: undefined,
  };
  private _value = ''; // Input value which is used by ngModel
  private _options: BoundarySelectInputComponentOptions = this.defaultOptions;

  private boundaryLayer; // WmsSelect

  public map;

  constructor(private elRef: ElementRef) {
    console.log('constructor', this.options);
  }

  ngOnInit(): void {
    this.initMap();
  }

  // ControlValueAccesor methods
  // write value to this component (map)
  writeValue(val: string): void {
    console.log('CVA::writeValue');
    this.value = val;
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
    // throw new Error("Method not implemented.");
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
  get options(): BoundarySelectInputComponentOptions {
    return this._options;
  }

  set options(obj) {
    console.log('set options');
    Object.assign(this._options, obj);

    if (this.map) {
      console.log('TODO: options settet. But nothing changed?');
    }
  }

  // @param value is a text representation of a bpolys GeoJSON FeatureCollection
  private updateMapFromValue(value) {
    console.log('Map <- Value', value);
    if (value == undefined || value.trim() === '') {
      this.boundaryLayer.clear();
      return;
    }

    //add featureCollection to boundaryLayer
    try {
      this.boundaryLayer.clear();
      const featureCollection = JSON.parse(value);
      this.boundaryLayer.addData(featureCollection);
      this.centerMapOnCurrentData();
    } catch (err) {
      console.log('GeoJSON can not be parsed.', err);
      this.boundaryLayer.clear();
    }
  }

  private centerMapOnCurrentData() {
    const bounds = this.boundaryLayer.getBounds();
    if(!bounds.isValid()) return;
    this.map.flyToBounds(this.boundaryLayer.getBounds(), {padding: [20, 20]});
  }

  private updateValueFromMap() {
    console.log('Map -> Value');
    const _value = JSON.stringify(this.boundaryLayer.getData());
    // update ngModel through ControlValueAccessor
    this.propagateChange(_value);
  }


  private initMap(): void {
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


    type LeafletSelectEvent = LeafletEvent & { selectionLayer: L.GeoJSON };

    // add select WMS layer
    this.boundaryLayer = wmsSelect('https://maps.heigit.org/ohsome/service/wms', {
      noWrap: true,
      layers: 'ohsome:admin_world_water',
      transparent: true,
      format: 'image/png',
      attribution: 'Downloaded from <a href="https://osm-boundaries.com" >OSM Boundaries Map</a>'
    }).addTo(this.map)
      .on('select', (e: LeafletEvent) => {
        const evt = e as LeafletSelectEvent;
        let newValue = '';
        const selectionLayer: L.GeoJSON = evt.selectionLayer;
        if (selectionLayer.getLayers().length != 0) {
          const jsonval = selectionLayer.toGeoJSON();
          if (jsonval.type !== 'GeometryCollection' && jsonval.type !== 'Feature') {
            jsonval.features.forEach(function (feature) {
              feature['id'] += '-_-' + feature['properties']['name'].replace(/ /g, '__');
            });
          }
          newValue = JSON.stringify(jsonval);
        }
        this.propagateChange(newValue);
      })
    ;
  }
}

export interface BoundarySelectInputComponentOptions {
  type: 'bpoly';
  label?: string | boolean;
  center: LatLngExpression;
  zoom: number;
  maxBounds?: LatLngBoundsExpression;
  minZoom?: number;
  maxZoom?: number;
  maskPoly?: Polygon | MultiPolygon | Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>;
}

