/**
 * @author M. Auer
 * inspired by https://gist.github.com/rclark/6908938#file-l-tilelayer-betterwms-js
 */
import * as L from 'leaflet';
import {CRS} from 'leaflet';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {GeoJsonObject} from 'geojson';
import {toWgs84} from '@turf/projection';
import truncate from "@turf/truncate";
import bbox from "@turf/bbox";

interface WmsSelectOptions {
  primaryKeyProperty: string
}

class WmsSelect extends L.TileLayer.WMS {

  private readonly _url;
  private wmsSelectOptions: WmsSelectOptions;

  constructor(url, wmsOptions, wmsSelectOptions: WmsSelectOptions = {primaryKeyProperty: 'id'}) {
    super(url, wmsOptions);
    this._url = url;
    this.wmsSelectOptions = wmsSelectOptions;
  }

  selectionLayer: L.GeoJSON = L.geoJSON();

  select(evt) {
    const clickLatLng = evt.latlng;
    // check if already feature at click position
    // CheapLayerAt:  var feature = map.getLayerAtLatLng(clickLatLng);
    // point in polygon:

    const featureArray = this.pointInLayer(clickLatLng, this.selectionLayer);
    if (featureArray.length == 0) {
      this.getFeatureInfo(evt);
    } else {
      this.selectionLayer.removeLayer(featureArray[0]);
      this.fire('select', {selectionLayer: this.selectionLayer}, true);
    }

  }

  clear() {
    this.selectionLayer.clearLayers();
  }

  addData(data: GeoJsonObject){
    this.selectionLayer.addData(data);
    console.log("data added");
  }

  getData(){
    return this.selectionLayer.toGeoJSON();
  }

  getBounds(): L.LatLngBounds {
    return this.selectionLayer.getBounds()
  }

  pointInLayer(point, layers) {
    const results: L.Layer[] = [];

    layers.eachLayer((l: L.Layer) => {
      if (results.length) return;

      if (l instanceof L.Polygon && booleanPointInPolygon([point.lng, point.lat], l.toGeoJSON() )) {
          results.push(l);
      }
    });
    return results;
  }

  override onAdd(map) {
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map);
    this.selectionLayer.addTo(map);
    map.on('click', this.select, this);
    return this;
  }

  override onRemove(map) {
    // Triggered when the layer is removed from a map.
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    this.selectionLayer.remove();
    map.off('click', this.select, this);
    return this;
  }

  getFeatureInfo(evt) {
    // Make an AJAX request to the server and hope for the best
    const url = this.getFeatureInfoUrl(evt);

    const request = new Request(url);

    fetch(request)
      .then((response) => {
        // console.log('fullfilled');
        if (response.ok && response.headers.get('Content-Type')?.toLowerCase().includes('json')) {
          return response.json();
        } else {
          // console.log('not fullfilled');
          response.text().then(console.log);
          throw new Error('Something went wrong with getFeatureInfo request!');
        }
      })
      .then((responseJson) => {
        // reproject response to WGS84
        toWgs84(responseJson, {mutate: true});
        // truncate coordinates to mitigate rounding errors
        truncate(responseJson, {precision: 7, mutate: true});
        // recalculate bbox for reprojected coordinates
        responseJson.bbox = bbox(responseJson, {recompute: true});

        const currentFeatures = this.selectionLayer.getLayers() as any[];

        let foundNewFeatures = false;

        responseJson.features.forEach(newFeature => {
          // recalculate bbox for reprojected coordinates
          newFeature.bbox = bbox(newFeature, {recompute: true});

          //new Feature already exists? do nothing else add to map
          let foundSameFeature = false;
          currentFeatures.forEach(currentFeature => {

            if (currentFeature.feature.properties[this.wmsSelectOptions.primaryKeyProperty] == newFeature.properties[this.wmsSelectOptions.primaryKeyProperty]) {
              foundSameFeature = true;
              return; //Do nothing, don't add features that we already have
            }
          })
          if (!foundSameFeature) {
            foundNewFeatures = true;

            // found a new feature -> add it to map
            this.selectionLayer.addData(newFeature);
          }
        })

        if (foundNewFeatures) {
          this.fire('select', {selectionLayer: this.selectionLayer}, true);
        }
      })
      .catch(error => {
        console.error(error);
      })
  }

  getFeatureInfoUrl(evt) {
    // Construct a GetFeatureInfo request URL given a point
    const point = evt.containerPoint,
      size = this._map.getSize(),
      lowerLeft = CRS.EPSG3857.project(this._map.getBounds().getSouthWest()),
      upperRight = CRS.EPSG3857.project(this._map.getBounds().getNorthEast()),
      params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        styles: this.wmsParams.styles,
        transparent: this.wmsParams.transparent,
        version: this.wmsParams.version,
        format: this.wmsParams.format,
        bbox: [lowerLeft.x, lowerLeft.y, upperRight.x, upperRight.y].join(','),
        height: size.y,
        width: size.x,
        layers: this.wmsParams.layers,
        query_layers: this.wmsParams.layers,
        info_format: 'application/json',
        buffer: 0,
        feature_count: 5
      };

    params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
    params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);
    params[params.version === '1.3.0' ? 'crs' : 'srs'] = 'EPSG:3857';
    console.log("GETFEATTURE_XY", Math.round(point.x), Math.round(point.y));
    console.log(L.Util.getParamString(params, this._url, true));
    return this._url + L.Util.getParamString(params, this._url, true);
  }
}

const wmsSelect = function (url, options) {
  return new WmsSelect(url, options);
};

export {wmsSelect};
