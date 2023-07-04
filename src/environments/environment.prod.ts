export const environment = {
  production: true,

  //ohsomeAPI (osm history stats from OSHDB)
  oshdbRestApiRootUrl : 'https://api.ohsome.org/v1',

  //oqtApi (ohsome quality analyst)
  oqtApiRootUrl: 'https://oqt.ohsome.org/api',
  // core, experimental, all, ...
  oqtApiProject: 'core',

  //the WFS endpoint which will get appended a CQL_FILTER="id" IN (number, number, ...) param and should return a GeoJSON<FeatureCollection>
  ohsomeBoundaryWFSUrl: 'https://maps.heigit.org/ohsome/wfs?service=wfs&request=GetFeature&typeNames=ohsome:admin_world_water&outputFormat=application/json&version=2.0.0&srsName=EPSG:4326',

  //map options
  zoomLevel : 2,
  mapCenter : {lat: 0.0, lng: 0.0},
  mapCenterFromPoly : false,

  //ohsomeAPI options
  selectedFilter : `building=* and building!=no and geometry:polygon`,
  selectedKey : 'natural',
  selectedValue : 'tree',
  selectedTypes : ['node'],
  period : 'P1M',
};
