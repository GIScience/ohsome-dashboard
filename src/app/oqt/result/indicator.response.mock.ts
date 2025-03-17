import {IndicatorResponseJSON} from '../types/types';

export const indicatorResponseMock: IndicatorResponseJSON = {
  'apiVersion': '0.14.2',
  'attribution': {
    'url': 'https://github.com/GIScience/ohsome-quality-analyst/blob/main/COPYRIGHTS.md',
    'text': '\u00a9 OpenStreetMap contributors'
  },
  'result': [{
    'metadata': {
      'name': 'Mapping Saturation',
      'description': 'Calculate if mapping has saturated. High saturation has been reached if the growth of the fitted curve is minimal.',
      'projects': ['core', 'corine-land-cover', 'expanse', 'experimental', 'idealvgi', 'mapaction', 'sketchmap'],
      'qualityDimension': 'completeness'
    },
    'topic': {
      'key': 'building-count',
      'name': 'Building Count',
      'description': 'All buildings as defined by all objects tagged with \'building=*\'.',
      'projects': ['core']
    },
    'result': {
      'description': 'The saturation of the last 3 years is 99.65%.High saturation has been reached (97% < Saturation \u2264 100%).',
      'timestampOQT': '2023-06-28T16:41:43.765463+00:00',
      'timestampOSM': '2023-06-01T00:00:00+00:00',
      'value': 0.9965102773791069,
      'class': 5,
      'figure': {
        'data': [{
          'name': 'OSM data',
          'x': ['2008-01-01T00:00:00+00:00', '2008-02-01T00:00:00+00:00', '2008-03-01T00:00:00+00:00', '2008-04-01T00:00:00+00:00', '2008-05-01T00:00:00+00:00', '2008-06-01T00:00:00+00:00', '2008-07-01T00:00:00+00:00', '2008-08-01T00:00:00+00:00', '2008-09-01T00:00:00+00:00', '2008-10-01T00:00:00+00:00', '2008-11-01T00:00:00+00:00', '2008-12-01T00:00:00+00:00', '2009-01-01T00:00:00+00:00', '2009-02-01T00:00:00+00:00', '2009-03-01T00:00:00+00:00', '2009-04-01T00:00:00+00:00', '2009-05-01T00:00:00+00:00', '2009-06-01T00:00:00+00:00', '2009-07-01T00:00:00+00:00', '2009-08-01T00:00:00+00:00', '2009-09-01T00:00:00+00:00', '2009-10-01T00:00:00+00:00', '2009-11-01T00:00:00+00:00', '2009-12-01T00:00:00+00:00', '2010-01-01T00:00:00+00:00', '2010-02-01T00:00:00+00:00', '2010-03-01T00:00:00+00:00', '2010-04-01T00:00:00+00:00', '2010-05-01T00:00:00+00:00', '2010-06-01T00:00:00+00:00', '2010-07-01T00:00:00+00:00', '2010-08-01T00:00:00+00:00', '2010-09-01T00:00:00+00:00', '2010-10-01T00:00:00+00:00', '2010-11-01T00:00:00+00:00', '2010-12-01T00:00:00+00:00', '2011-01-01T00:00:00+00:00', '2011-02-01T00:00:00+00:00', '2011-03-01T00:00:00+00:00', '2011-04-01T00:00:00+00:00', '2011-05-01T00:00:00+00:00', '2011-06-01T00:00:00+00:00', '2011-07-01T00:00:00+00:00', '2011-08-01T00:00:00+00:00', '2011-09-01T00:00:00+00:00', '2011-10-01T00:00:00+00:00', '2011-11-01T00:00:00+00:00', '2011-12-01T00:00:00+00:00', '2012-01-01T00:00:00+00:00', '2012-02-01T00:00:00+00:00', '2012-03-01T00:00:00+00:00', '2012-04-01T00:00:00+00:00', '2012-05-01T00:00:00+00:00', '2012-06-01T00:00:00+00:00', '2012-07-01T00:00:00+00:00', '2012-08-01T00:00:00+00:00', '2012-09-01T00:00:00+00:00', '2012-10-01T00:00:00+00:00', '2012-11-01T00:00:00+00:00', '2012-12-01T00:00:00+00:00', '2013-01-01T00:00:00+00:00', '2013-02-01T00:00:00+00:00', '2013-03-01T00:00:00+00:00', '2013-04-01T00:00:00+00:00', '2013-05-01T00:00:00+00:00', '2013-06-01T00:00:00+00:00', '2013-07-01T00:00:00+00:00', '2013-08-01T00:00:00+00:00', '2013-09-01T00:00:00+00:00', '2013-10-01T00:00:00+00:00', '2013-11-01T00:00:00+00:00', '2013-12-01T00:00:00+00:00', '2014-01-01T00:00:00+00:00', '2014-02-01T00:00:00+00:00', '2014-03-01T00:00:00+00:00', '2014-04-01T00:00:00+00:00', '2014-05-01T00:00:00+00:00', '2014-06-01T00:00:00+00:00', '2014-07-01T00:00:00+00:00', '2014-08-01T00:00:00+00:00', '2014-09-01T00:00:00+00:00', '2014-10-01T00:00:00+00:00', '2014-11-01T00:00:00+00:00', '2014-12-01T00:00:00+00:00', '2015-01-01T00:00:00+00:00', '2015-02-01T00:00:00+00:00', '2015-03-01T00:00:00+00:00', '2015-04-01T00:00:00+00:00', '2015-05-01T00:00:00+00:00', '2015-06-01T00:00:00+00:00', '2015-07-01T00:00:00+00:00', '2015-08-01T00:00:00+00:00', '2015-09-01T00:00:00+00:00', '2015-10-01T00:00:00+00:00', '2015-11-01T00:00:00+00:00', '2015-12-01T00:00:00+00:00', '2016-01-01T00:00:00+00:00', '2016-02-01T00:00:00+00:00', '2016-03-01T00:00:00+00:00', '2016-04-01T00:00:00+00:00', '2016-05-01T00:00:00+00:00', '2016-06-01T00:00:00+00:00', '2016-07-01T00:00:00+00:00', '2016-08-01T00:00:00+00:00', '2016-09-01T00:00:00+00:00', '2016-10-01T00:00:00+00:00', '2016-11-01T00:00:00+00:00', '2016-12-01T00:00:00+00:00', '2017-01-01T00:00:00+00:00', '2017-02-01T00:00:00+00:00', '2017-03-01T00:00:00+00:00', '2017-04-01T00:00:00+00:00', '2017-05-01T00:00:00+00:00', '2017-06-01T00:00:00+00:00', '2017-07-01T00:00:00+00:00', '2017-08-01T00:00:00+00:00', '2017-09-01T00:00:00+00:00', '2017-10-01T00:00:00+00:00', '2017-11-01T00:00:00+00:00', '2017-12-01T00:00:00+00:00', '2018-01-01T00:00:00+00:00', '2018-02-01T00:00:00+00:00', '2018-03-01T00:00:00+00:00', '2018-04-01T00:00:00+00:00', '2018-05-01T00:00:00+00:00', '2018-06-01T00:00:00+00:00', '2018-07-01T00:00:00+00:00', '2018-08-01T00:00:00+00:00', '2018-09-01T00:00:00+00:00', '2018-10-01T00:00:00+00:00', '2018-11-01T00:00:00+00:00', '2018-12-01T00:00:00+00:00', '2019-01-01T00:00:00+00:00', '2019-02-01T00:00:00+00:00', '2019-03-01T00:00:00+00:00', '2019-04-01T00:00:00+00:00', '2019-05-01T00:00:00+00:00', '2019-06-01T00:00:00+00:00', '2019-07-01T00:00:00+00:00', '2019-08-01T00:00:00+00:00', '2019-09-01T00:00:00+00:00', '2019-10-01T00:00:00+00:00', '2019-11-01T00:00:00+00:00', '2019-12-01T00:00:00+00:00', '2020-01-01T00:00:00+00:00', '2020-02-01T00:00:00+00:00', '2020-03-01T00:00:00+00:00', '2020-04-01T00:00:00+00:00', '2020-05-01T00:00:00+00:00', '2020-06-01T00:00:00+00:00', '2020-07-01T00:00:00+00:00', '2020-08-01T00:00:00+00:00', '2020-09-01T00:00:00+00:00', '2020-10-01T00:00:00+00:00', '2020-11-01T00:00:00+00:00', '2020-12-01T00:00:00+00:00', '2021-01-01T00:00:00+00:00', '2021-02-01T00:00:00+00:00', '2021-03-01T00:00:00+00:00', '2021-04-01T00:00:00+00:00', '2021-05-01T00:00:00+00:00', '2021-06-01T00:00:00+00:00', '2021-07-01T00:00:00+00:00', '2021-08-01T00:00:00+00:00', '2021-09-01T00:00:00+00:00', '2021-10-01T00:00:00+00:00', '2021-11-01T00:00:00+00:00', '2021-12-01T00:00:00+00:00', '2022-01-01T00:00:00+00:00', '2022-02-01T00:00:00+00:00', '2022-03-01T00:00:00+00:00', '2022-04-01T00:00:00+00:00', '2022-05-01T00:00:00+00:00', '2022-06-01T00:00:00+00:00', '2022-07-01T00:00:00+00:00', '2022-08-01T00:00:00+00:00', '2022-09-01T00:00:00+00:00', '2022-10-01T00:00:00+00:00', '2022-11-01T00:00:00+00:00', '2022-12-01T00:00:00+00:00', '2023-01-01T00:00:00+00:00', '2023-02-01T00:00:00+00:00', '2023-03-01T00:00:00+00:00', '2023-04-01T00:00:00+00:00', '2023-05-01T00:00:00+00:00', '2023-06-01T00:00:00+00:00'],
          'y': [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 3.0, 3.0, 3.0, 3.0, 12.0, 12.0, 12.0, 42.0, 42.0, 43.0, 43.0, 43.0, 43.0, 43.0, 43.0, 43.0, 48.0, 49.0, 267.0, 651.0, 685.0, 735.0, 792.0, 794.0, 798.0, 796.0, 901.0, 908.0, 910.0, 911.0, 911.0, 913.0, 1098.0, 1202.0, 1210.0, 1211.0, 1216.0, 1220.0, 1256.0, 1259.0, 1260.0, 1380.0, 1380.0, 1385.0, 1410.0, 1447.0, 1486.0, 1494.0, 1500.0, 1508.0, 1703.0, 1772.0, 1833.0, 1919.0, 2024.0, 2339.0, 2651.0, 3574.0, 3947.0, 4039.0, 4039.0, 4687.0, 4691.0, 5736.0, 6119.0, 6754.0, 7231.0, 8204.0, 9124.0, 10261.0, 10802.0, 10874.0, 10884.0, 10894.0, 10905.0, 10925.0, 10944.0, 10994.0, 11007.0, 11052.0, 11154.0, 11314.0, 11314.0, 11346.0, 11346.0, 11348.0, 11378.0, 11376.0, 11381.0, 11382.0, 11383.0, 11381.0, 11390.0, 11391.0, 11402.0, 11408.0, 11401.0, 11403.0, 11409.0, 11410.0, 13079.0, 13160.0, 13534.0, 13569.0, 13574.0, 13569.0, 13581.0, 13582.0, 13583.0, 13583.0, 13590.0, 13595.0, 13598.0, 13602.0, 13606.0, 13632.0, 13700.0, 13700.0, 13721.0, 13709.0, 13713.0, 13834.0, 13841.0, 13842.0, 13859.0, 13877.0, 13886.0, 13887.0, 13886.0, 13881.0, 13881.0, 14307.0, 14450.0, 14457.0, 14470.0, 14542.0, 14593.0, 14610.0, 14609.0, 14600.0, 14601.0, 14605.0, 14615.0, 14626.0, 14627.0, 14632.0, 14632.0, 14643.0, 14650.0, 14783.0, 15166.0, 15189.0, 15207.0, 15208.0, 15213.0, 15222.0, 15236.0, 15236.0, 15236.0, 15236.0, 15236.0, 15242.0, 15299.0, 15299.0, 15299.0, 15299.0, 15300.0, 15299.0],
          'type': 'scatter'
        }, {
          'name': 'Fitted data',
          'x': ['2008-01-01T00:00:00+00:00', '2008-02-01T00:00:00+00:00', '2008-03-01T00:00:00+00:00', '2008-04-01T00:00:00+00:00', '2008-05-01T00:00:00+00:00', '2008-06-01T00:00:00+00:00', '2008-07-01T00:00:00+00:00', '2008-08-01T00:00:00+00:00', '2008-09-01T00:00:00+00:00', '2008-10-01T00:00:00+00:00', '2008-11-01T00:00:00+00:00', '2008-12-01T00:00:00+00:00', '2009-01-01T00:00:00+00:00', '2009-02-01T00:00:00+00:00', '2009-03-01T00:00:00+00:00', '2009-04-01T00:00:00+00:00', '2009-05-01T00:00:00+00:00', '2009-06-01T00:00:00+00:00', '2009-07-01T00:00:00+00:00', '2009-08-01T00:00:00+00:00', '2009-09-01T00:00:00+00:00', '2009-10-01T00:00:00+00:00', '2009-11-01T00:00:00+00:00', '2009-12-01T00:00:00+00:00', '2010-01-01T00:00:00+00:00', '2010-02-01T00:00:00+00:00', '2010-03-01T00:00:00+00:00', '2010-04-01T00:00:00+00:00', '2010-05-01T00:00:00+00:00', '2010-06-01T00:00:00+00:00', '2010-07-01T00:00:00+00:00', '2010-08-01T00:00:00+00:00', '2010-09-01T00:00:00+00:00', '2010-10-01T00:00:00+00:00', '2010-11-01T00:00:00+00:00', '2010-12-01T00:00:00+00:00', '2011-01-01T00:00:00+00:00', '2011-02-01T00:00:00+00:00', '2011-03-01T00:00:00+00:00', '2011-04-01T00:00:00+00:00', '2011-05-01T00:00:00+00:00', '2011-06-01T00:00:00+00:00', '2011-07-01T00:00:00+00:00', '2011-08-01T00:00:00+00:00', '2011-09-01T00:00:00+00:00', '2011-10-01T00:00:00+00:00', '2011-11-01T00:00:00+00:00', '2011-12-01T00:00:00+00:00', '2012-01-01T00:00:00+00:00', '2012-02-01T00:00:00+00:00', '2012-03-01T00:00:00+00:00', '2012-04-01T00:00:00+00:00', '2012-05-01T00:00:00+00:00', '2012-06-01T00:00:00+00:00', '2012-07-01T00:00:00+00:00', '2012-08-01T00:00:00+00:00', '2012-09-01T00:00:00+00:00', '2012-10-01T00:00:00+00:00', '2012-11-01T00:00:00+00:00', '2012-12-01T00:00:00+00:00', '2013-01-01T00:00:00+00:00', '2013-02-01T00:00:00+00:00', '2013-03-01T00:00:00+00:00', '2013-04-01T00:00:00+00:00', '2013-05-01T00:00:00+00:00', '2013-06-01T00:00:00+00:00', '2013-07-01T00:00:00+00:00', '2013-08-01T00:00:00+00:00', '2013-09-01T00:00:00+00:00', '2013-10-01T00:00:00+00:00', '2013-11-01T00:00:00+00:00', '2013-12-01T00:00:00+00:00', '2014-01-01T00:00:00+00:00', '2014-02-01T00:00:00+00:00', '2014-03-01T00:00:00+00:00', '2014-04-01T00:00:00+00:00', '2014-05-01T00:00:00+00:00', '2014-06-01T00:00:00+00:00', '2014-07-01T00:00:00+00:00', '2014-08-01T00:00:00+00:00', '2014-09-01T00:00:00+00:00', '2014-10-01T00:00:00+00:00', '2014-11-01T00:00:00+00:00', '2014-12-01T00:00:00+00:00', '2015-01-01T00:00:00+00:00', '2015-02-01T00:00:00+00:00', '2015-03-01T00:00:00+00:00', '2015-04-01T00:00:00+00:00', '2015-05-01T00:00:00+00:00', '2015-06-01T00:00:00+00:00', '2015-07-01T00:00:00+00:00', '2015-08-01T00:00:00+00:00', '2015-09-01T00:00:00+00:00', '2015-10-01T00:00:00+00:00', '2015-11-01T00:00:00+00:00', '2015-12-01T00:00:00+00:00', '2016-01-01T00:00:00+00:00', '2016-02-01T00:00:00+00:00', '2016-03-01T00:00:00+00:00', '2016-04-01T00:00:00+00:00', '2016-05-01T00:00:00+00:00', '2016-06-01T00:00:00+00:00', '2016-07-01T00:00:00+00:00', '2016-08-01T00:00:00+00:00', '2016-09-01T00:00:00+00:00', '2016-10-01T00:00:00+00:00', '2016-11-01T00:00:00+00:00', '2016-12-01T00:00:00+00:00', '2017-01-01T00:00:00+00:00', '2017-02-01T00:00:00+00:00', '2017-03-01T00:00:00+00:00', '2017-04-01T00:00:00+00:00', '2017-05-01T00:00:00+00:00', '2017-06-01T00:00:00+00:00', '2017-07-01T00:00:00+00:00', '2017-08-01T00:00:00+00:00', '2017-09-01T00:00:00+00:00', '2017-10-01T00:00:00+00:00', '2017-11-01T00:00:00+00:00', '2017-12-01T00:00:00+00:00', '2018-01-01T00:00:00+00:00', '2018-02-01T00:00:00+00:00', '2018-03-01T00:00:00+00:00', '2018-04-01T00:00:00+00:00', '2018-05-01T00:00:00+00:00', '2018-06-01T00:00:00+00:00', '2018-07-01T00:00:00+00:00', '2018-08-01T00:00:00+00:00', '2018-09-01T00:00:00+00:00', '2018-10-01T00:00:00+00:00', '2018-11-01T00:00:00+00:00', '2018-12-01T00:00:00+00:00', '2019-01-01T00:00:00+00:00', '2019-02-01T00:00:00+00:00', '2019-03-01T00:00:00+00:00', '2019-04-01T00:00:00+00:00', '2019-05-01T00:00:00+00:00', '2019-06-01T00:00:00+00:00', '2019-07-01T00:00:00+00:00', '2019-08-01T00:00:00+00:00', '2019-09-01T00:00:00+00:00', '2019-10-01T00:00:00+00:00', '2019-11-01T00:00:00+00:00', '2019-12-01T00:00:00+00:00', '2020-01-01T00:00:00+00:00', '2020-02-01T00:00:00+00:00', '2020-03-01T00:00:00+00:00', '2020-04-01T00:00:00+00:00', '2020-05-01T00:00:00+00:00', '2020-06-01T00:00:00+00:00', '2020-07-01T00:00:00+00:00', '2020-08-01T00:00:00+00:00', '2020-09-01T00:00:00+00:00', '2020-10-01T00:00:00+00:00', '2020-11-01T00:00:00+00:00', '2020-12-01T00:00:00+00:00', '2021-01-01T00:00:00+00:00', '2021-02-01T00:00:00+00:00', '2021-03-01T00:00:00+00:00', '2021-04-01T00:00:00+00:00', '2021-05-01T00:00:00+00:00', '2021-06-01T00:00:00+00:00', '2021-07-01T00:00:00+00:00', '2021-08-01T00:00:00+00:00', '2021-09-01T00:00:00+00:00', '2021-10-01T00:00:00+00:00', '2021-11-01T00:00:00+00:00', '2021-12-01T00:00:00+00:00', '2022-01-01T00:00:00+00:00', '2022-02-01T00:00:00+00:00', '2022-03-01T00:00:00+00:00', '2022-04-01T00:00:00+00:00', '2022-05-01T00:00:00+00:00', '2022-06-01T00:00:00+00:00', '2022-07-01T00:00:00+00:00', '2022-08-01T00:00:00+00:00', '2022-09-01T00:00:00+00:00', '2022-10-01T00:00:00+00:00', '2022-11-01T00:00:00+00:00', '2022-12-01T00:00:00+00:00', '2023-01-01T00:00:00+00:00', '2023-02-01T00:00:00+00:00', '2023-03-01T00:00:00+00:00', '2023-04-01T00:00:00+00:00', '2023-05-01T00:00:00+00:00', '2023-06-01T00:00:00+00:00'],
          'y': [-15.107728632821798, -14.246737353169932, -13.308432471719692, -12.285883056026806, -11.171538999674938, -9.95717611468883, -8.633836431186207, -7.191763300332504, -5.620330865366473, -3.907967432282529, -2.042072236686309, -0.008925066413066673, 2.2064118392163863, 4.620200233016906, 7.25014130783833, 10.115500853280903, 13.237244869814749, 16.638186433410223, 20.343144648198372, 24.37911656825629, 28.775463011432326, 33.564109227051574, 38.77976141396931, 44.46014011405609, 50.646231526725884, 57.382557800055906, 64.71746735039562, 72.70344624155764, 81.39745161249527, 90.86126807382858, 101.16188789284894, 112.37191564692681, 124.56999783870369, 137.8412777240237, 152.2778752949142, 167.97939197333636, 185.05343909369387, 203.61618866852956, 223.7929442262419, 245.718728664407, 269.53888505852785, 295.40968518394686, 323.49893912798024, 353.9865977700295, 387.06533807064324, 422.941119019906, 461.83369373896596, 503.9770606002163, 549.6198333349474, 599.0255069479437, 652.4725928886547, 710.2545933913935, 772.6797812718618, 840.0707478655268, 912.7636783640909, 991.1073107424204, 1075.4615320114601, 1166.1955639770697, 1263.685690378407, 1368.3124786218823, 1480.4574527613086, 1600.499180374897, 1728.8087450357928, 1865.7445886203468, 2011.6467241346631, 2166.8303403299833, 2331.578844199794, 2506.1364163272347, 2690.7001864712165, 2885.412171836812, 3090.351156814176, 3305.5247287625593, 3530.8617173795883, 3766.2053126666738, 4011.3071555682127, 4265.822703070764, 4529.308163166323, 4801.219272412775, 5080.912148530825, 5367.646392400729, 5660.590539221272, 5958.829870268447, 6261.3764989573065, 6567.181543384377, 6875.149098735273, 7184.151633764449, 7493.046362580796, 7800.692091827504, 8105.966018082213, 8407.779952958797, 8705.095483750398, 8996.937633074203, 9282.406657471529, 9560.687716426972, 9831.058243101834, 10092.892949366647, 10345.666494074132, 10588.953929539724, 10822.429112852433, 11045.861323416371, 11259.110365046632, 11462.120450413822, 11654.913169171354, 11837.579831032186, 12010.273454184571, 12173.200640713638, 12326.613547005905, 12470.802121057193, 12606.086742381758, 12732.811365570491, 12851.33723673713, 12962.037223951354, 13065.2907787273, 13161.479525841036, 13250.983463071294, 13334.177740601954, 13411.429981388663, 13483.098098311799, 13549.528560933091, 13611.055063673872, 13667.997547803747, 13720.66153137857, 13769.337703858819, 13814.30174528895, 13855.814333393482, 13894.12130556195, 13929.453946310803, 13962.029374321306, 13992.051006484082, 14019.70907948464, 14045.181212311203, 14068.63299564307, 14090.218596383747, 14110.081367644616, 14128.354456275749, 14145.161401597037, 14160.616720324555, 14174.82647383406, 14187.888814875934, 14199.894511673345, 14210.927448016873, 14221.065098531097, 14230.378978748276, 14238.935069995108, 14246.794219393914, 14254.012515510762, 14260.641640360065, 14266.729198607036, 14272.319024903518, 14277.451470355916, 14282.16366916172, 14286.48978646841, 14290.461248509355, 14294.10695605919, 14297.453482228873, 14300.525255590857, 14303.34472958907, 14305.932539148984, 14308.307645360765, 14310.487469064676, 14312.488014123432, 14314.323981121826, 14316.008872189832, 14317.555087602714, 14318.974014769858, 14320.27611018406, 14321.470974864553, 14322.567423790557, 14323.573549787336, 14324.496782293952, 14325.343941411013, 14326.121287597522, 14326.834567358746, 14327.489055241487, 14328.089592429234, 14328.640622207551, 14329.14622254927, 14329.610136049885, 14330.035797425662, 14330.426358770379, 14330.784712751312, 14331.113513910832, 14331.415198226809, 14331.692001072945, 14331.945973708831, 14332.178998419193],
          'type': 'scatter'
        }], 'layout': {'title': {'text': 'Mapping Saturation'}, 'xaxis': {'title': {'text': 'Date'}}, 'yaxis': {'title': {'text': 'Value'}}}
      },
      'label': 'green'
    },
    'id': -2967179,
    'iso': null,
    'display_name': 'Verwaltungsverband Philippsburg',
    'name': 'Verwaltungsverband Philippsburg',
    'name_en': null,
    'local_name': 'Verwaltungsverband Philippsburg',
    'long_name': null,
    'boundary': 'administrative',
    'admin_level': 7,
    'wikidata': 'Q9392569',
    'wikipedia': null,
    'parents': '{-62393,-22027,-62611,-51477}',
    'parent': -62393,
    'min_scale': 500000,
    'max_scale': 1000000
  }]
};
