// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --configuration=production` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

import {AppEnvironment} from '../app/shared/shared-types';

export const environment: AppEnvironment = {
  production: false,

  //ohsomeAPI (stats and extraction)
  ohsomeApiRootUrl: 'https://api.heigit.org/ohsome-api-staging/v2',
  // ohsomeApiRootUrl : 'https://staging-ohsome-api.heigitk8s.de',

  ohsomeApiDocsUrl: 'https://docs.ohsome.org/ohsome-api/staging/',

  //oqtApi (ohsome quality analyst)
  // oqtApiRootUrl: 'https://api.quality.ohsome.org/v1',
  // oqtApiRootUrl: 'https://api.quality.ohsome.org/v1-test/',
  oqtApiRootUrl: 'https://api.heigit.org/ohsome-quality-api-staging/v1',
  // oqtApiRootUrl: 'http://127.0.0.1:8000',
  defaultTopicKey: 'cycleway',

  //the WFS endpoint which will get appended a CQL_FILTER="id" IN (number, number, ...) param and should return a GeoJSON<FeatureCollection>
  ohsomeBoundaryWFSUrl: 'https://maps.heigit.org/vector/service/ohsome/wfs?service=wfs&request=GetFeature&typeNames=ohsome:admin_world_water&outputFormat=application/json&version=2.0.0&srsName=EPSG:4326',
  ohsomeBoundaryWMSUrl: 'https://maps.heigit.org/raster/ohsome/wms',
  ohsomeBoundaryWMSLayer: 'ohsome:admin_world_water',

  // url to fetch an announcement text
  announcementUrl: 'https://dashboard.ohsome.org/statuspage',

  //map options
  mapOptions: {
    zoom: 10,
    center: {lat: 49.41, lng: 8.68},
    mapCenterFromPoly: false,
    //maskPoly: bboxPolygon([-180, -90, 180, 90]).geometry,
    // minZoom
    // maxZoom
    // maxBounds
    // label
  },

  // zoomLevel : 10,
  // mapCenter : {lat: 49.41, lng: 8.68},
  // mapCenterFromPoly : false,
  // maskPoly: bboxPolygon([-180, -90, 180, 90]).geometry,

  // boundaryType : 'admin',
  // bpolys : 'Cyclone Idai Region:35.2880804,-20.7920609,35.0134222,-20.1075181,' +
  //   '39.4518933,-17.1617754,38.6389050,-15.4324902,' +
  //   '35.2441186,-13.3682218,30.1025170,-15.0084424,' +
  //   '31.7284936,-22.0652577,35.2880804,-20.7920609', // idai hotosm project polygon

  //ohsomeAPI options
  // selectedFilter : `building=* and building!=no and geometry:polygon`,
  // selectedKey : 'historic',
  // selectedValue : '',
  // selectedTypes : ['node', 'way'],
  // startDate : '2019-03-01',
  // endDate : '2020-03-01',
  interval: 'P1Y',
  viewUpdateTime: false,

  // userManagement
  // appwriteEndpoint: 'https://staging.api.account.heigit.org',
  // appwriteProjectId: '66cef0a9000b0675681b', //dev on staging
  // accountFrontendUrl: "https://staging.account.heigit.org",
  // skipAppwriteAPIKey: "",

  appwriteEndpoint: 'https://api.account.heigit.org',
  appwriteProjectId: '6a158c93000c7437fe54', //dev on prod
  accountFrontendUrl: "https://dev.account.heigit.org",
  cookieUrl: 'https://cookie-dev.api.account.heigit.org',
  skipAppwriteAPIKey: "",
};
