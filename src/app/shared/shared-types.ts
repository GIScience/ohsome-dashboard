import {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import * as L from 'leaflet';

interface AppEnvironment {
  production: boolean;
  oshdbRestApiRootUrl : string;
  ohsomeApiRootUrl : string;
  oqtApiRootUrl: string;
  oqtApiProject: string; //take from OpenApiSpec
  defaultTopicKey: string; //take from OpenApiSpec
  ohsomeBoundaryWFSUrl: string;
  ohsomeBoundaryWMSUrl: string;
  ohsomeBoundaryWMSLayer: string;
  announcementUrl: string;
  mapOptions: BoundaryInputComponentOptions & {
    mapCenterFromPoly: boolean;
  };
  period: string; //ISO8601 period
  viewUpdateTime?: boolean;
  appwriteEndpoint: string;
  appwriteProjectId: string;
  accountFrontendUrl: string;
  cookieUrl: string;
  skipAppwriteAPIKey: string;
}

const QUERY_MODES = ['ohsomeApi', 'oqtApi', 'extraction'] as const;

type QueryMode = typeof QUERY_MODES[number];

function isQueryMode(value: unknown): value is QueryMode {
  console.log("QUERY_MODE:", value);
  return typeof value === 'string' &&
    QUERY_MODES.includes(value as QueryMode);
}

function isTopic(topicParam: string | null, oqtApiMetadataProviderService): boolean {
  const availableTopics = Object.keys(oqtApiMetadataProviderService.getOqtApiMetadata().result.topics);
  return !!topicParam && availableTopics.includes(topicParam);
}


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
type BoundaryType = 'admin' | 'bbox' | 'bpoly';

// determines which drawing interaction will be available when instantiating the BoundaryInputComponent
type BoundaryInputComponentInteractionType = 'bbox' | 'bpoly';

interface BoundaryInputComponentOptions {
  label?: string | boolean;
  center: L.LatLngExpression;
  zoom: number;
  maxBounds?: L.LatLngBoundsExpression;
  minZoom?: number;
  maxZoom?: number;
  maskPoly?: Polygon | MultiPolygon | Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>;
  userDefinedPolygonLayers?: Userlayer[];
}

// removes the optional (?) and nullish values from types or interfaces
type RequiredAndDefined<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>
};

export {
  AppEnvironment,
  QueryMode,
  isQueryMode,
  isTopic,
  GrowthRateCssClass,
  BoundaryType,
  Userlayer,
  BoundaryInputComponentInteractionType,
  BoundaryInputComponentOptions,
  RequiredAndDefined
}
