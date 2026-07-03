export const environment = {
  production: true,

  //ohsomeAPI (osm history stats from OSHDB)
  oshdbRestApiRootUrl : 'https://api.ohsome.org/v1',
  ohsomeApiRootUrl : 'https://api.heigit.org/ohsome-api-staging/v2',

  //oqtApi (ohsome quality analyst)
  oqtApiRootUrl: 'https://api.quality.ohsome.org/v1-test/',

  // core, experimental, all, ...
  oqtApiProject: 'all',
  defaultTopicKey: 'cycleway',

  //the WFS endpoint which will get appended a CQL_FILTER="id" IN (number, number, ...) param and should return a GeoJSON<FeatureCollection>
  ohsomeBoundaryWFSUrl: 'https://maps.heigit.org/vector/service/ohsome/wfs?service=wfs&request=GetFeature&typeNames=ohsome:admin_world_water&outputFormat=application/json&version=2.0.0&srsName=EPSG:4326',
  ohsomeBoundaryWMSUrl: 'https://maps.heigit.org/raster/ohsome/wms',
  ohsomeBoundaryWMSLayer: 'ohsome:admin_world_water',

  // url to fetch an announcement text
  announcementUrl: 'https://dashboard.ohsome.org/statuspage',

  //map options
  zoomLevel : 2,
  mapCenter : {lat: 0.0, lng: 0.0},
  mapCenterFromPoly : false,

  //ohsomeAPI options
  selectedFilter : `natural=tree and type:node`,
  selectedKey : 'natural',
  selectedValue : 'tree',
  selectedTypes : ['node'],
  period : 'P1M',

  // userManagement
  appwriteEndpoint: 'https://api.account.heigit.org',
  appwriteProjectId: '6a158c93000c7437fe54',
  accountFrontendUrl: "https://account.heigit.org",
  skipAppwriteAPIKey: ""
};
