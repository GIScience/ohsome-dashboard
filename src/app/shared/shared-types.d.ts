import {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import * as L from 'leaflet';

/**
 * Defines the arrow icon at the growth rate stat
 */
type GrowthRateCssClass = 'up' | 'down' | 'right' | '';

interface Userlayer {
  name: string;
  title: string;
  data: Polygon | MultiPolygon | Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>;
  style?: L.PathOptions
}

// determines which map will be instantiated
type BoundaryType = 'admin' | 'bbox' | 'bcircle' | 'bpoly';

// determines which drawing interaction will be available when instantiating the BoundaryInputComponent
type BoundaryInputComponentInteractionType = 'bbox' | 'bcircle' | 'bpoly';
interface BoundaryInputComponentOptions {
  label?: string | boolean;
  center: L.LatLngExpression;
  zoom: number;
  maxBounds?: L.LatLngBoundsExpression;
  minZoom?: number;
  maxZoom?: number;
  maskPoly?: Polygon | MultiPolygon | Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>;
  userDefinedPolygonLayers?: Userlayer[]
}

export {
  GrowthRateCssClass,
  BoundaryType,
  Userlayer,
  BoundaryInputComponentInteractionType,
  BoundaryInputComponentOptions
}
