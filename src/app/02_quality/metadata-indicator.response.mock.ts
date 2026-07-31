export const oqtMetadataIndicatorsResponseMock = {
  'api-version': '0.14.1',
  'attribution': {
    'url': 'https://github.com/GIScience/ohsome-quality-analyst/blob/main/data/COPYRIGHTS.md'
  },
  'result': [
    {
      'key': 'mapping-saturation',
      'name': 'Mapping Saturation',
      'description': 'Calculate if mapping has saturated.\nHigh saturation has been reached if the growth of the fitted curve is minimal.',
      'quality-dimension': ['completeness'],
      'label-description': {
        'red': 'No saturation identified (Saturation ≤ 30%).',
        'yellow': 'Saturation is in progress (30% < Saturation ≤ 97%).',
        'green': 'High saturation has been reached (97% < Saturation ≤ 100%).',
        'undefined': 'Saturation could not be calculated.'
      }
    },
    {
      'key': 'currentness',
      'name': 'Currentness',
      'description': 'Calculate the currentness.',
      'quality-dimension': ['currentness'],
      'label-description': {
        'red': 'No saturation identified (Saturation ≤ 30%).',
        'yellow': 'Saturation is in progress (30% < Saturation ≤ 97%).',
        'green': 'High saturation has been reached (97% < Saturation ≤ 100%).',
        'undefined': 'Saturation could not be calculated.'
      }
    },
    {
      'key': 'attribute-completeness',
      'name': 'Attribute Completeness',
      'description': 'Calculate the currentness.',
      'quality-dimension': ['completeness'],
      'label-description': {
        'red': 'No saturation identified (Saturation ≤ 30%).',
        'yellow': 'Saturation is in progress (30% < Saturation ≤ 97%).',
        'green': 'High saturation has been reached (97% < Saturation ≤ 100%).',
        'undefined': 'Saturation could not be calculated.'
      }
    },
    {
      'key': 'poi-density',
      'name': 'POI Density',
      'description': 'Calculate the POI Density.',
      'quality-dimension': ['completeness'],
      'label-description': {
        'red': 'No saturation identified (Saturation ≤ 30%).',
        'yellow': 'Saturation is in progress (30% < Saturation ≤ 97%).',
        'green': 'High saturation has been reached (97% < Saturation ≤ 100%).',
        'undefined': 'Saturation could not be calculated.'
      }
    },
  ]
};
