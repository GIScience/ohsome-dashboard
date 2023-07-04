export const environment = {
  production: true,

  oshdbRestApiRootUrl : 'https://api.ohsome.org/v1',
  zoomLevel : 5,
  mapCenter : {lat: -19.0, lng: 37.0},
  mapCenterFromPoly : false,
  boundaryType : 'bpoly',
  bpolys : 'Cyclone Idai Region:35.2880804,-20.7920609,35.0134222,-20.1075181,' +
    '39.4518933,-17.1617754,38.6389050,-15.4324902,' +
    '35.2441186,-13.3682218,30.1025170,-15.0084424,' +
    '31.7284936,-22.0652577,35.2880804,-20.7920609', // idai hotosm project polygon
  selectedFilter : `building=* and building!=no and geometry:polygon`,
  selectedKey : 'building',
  selectedValue : '',
  selectedTypes : ['way'],
  startDate : '2019-03-01',
  endDate : '',
  period : 'P1D',
  viewUpdateTime : true,
};

