import {AppEnvironment} from '../app/shared/shared-types';

export const environment: AppEnvironment = {
  production: true,

  //ohsomeAPI (stats and extraction)
  ohsomeApiRootUrl : 'https://api.heigit.org/ohsome-api-staging/v2',

  ohsomeApiDocsUrl: 'https://docs.ohsome.org/ohsome-api/staging/',

  //oqtApi (ohsome quality analyst)
  // oqtApiRootUrl: 'https://api.quality.ohsome.org/v1-test/',
  oqtApiRootUrl: 'https://api.heigit.org/ohsome-quality-api-staging/v1',

  defaultTopicKey: 'cycleway',

  //the WFS endpoint which will get appended a CQL_FILTER="id" IN (number, number, ...) param and should return a GeoJSON<FeatureCollection>
  ohsomeBoundaryWFSUrl: 'https://maps.heigit.org/vector/service/ohsome/wfs?service=wfs&request=GetFeature&typeNames=ohsome:admin_world_water&outputFormat=application/json&version=2.0.0&srsName=EPSG:4326',
  ohsomeBoundaryWMSUrl: 'https://maps.heigit.org/raster/ohsome/wms',
  ohsomeBoundaryWMSLayer: 'ohsome:admin_world_water',

  // url to fetch an announcement text
  announcementUrl: 'https://dashboard.ohsome.org/statuspage',

  //map options
  mapOptions: {
    zoom: 2,
    center: {lat: 0.0, lng: 0.0},
    mapCenterFromPoly : false,
  },

  // zoomLevel : 2,
  // mapCenter : {lat: 0.0, lng: 0.0},
  // mapCenterFromPoly : false,
  // maskPoly: bboxPolygon([-180, -90, 180, 90]).geometry,

  //ohsomeAPI options
  // selectedFilter : `natural=tree and type:node`,
  // selectedKey : 'natural',
  // selectedValue : 'tree',
  // selectedTypes : ['node'],
  interval : 'P1Y',

  // userManagement
  appwriteEndpoint: 'https://api.account.heigit.org',
  appwriteProjectId: '6751abc5002d7cdf3ab7', //prod on prod
  accountFrontendUrl: "https://account.heigit.org",
  cookieUrl: 'https://cookie.api.account.heigit.org',
  skipAppwriteAPIKey: ""
};
