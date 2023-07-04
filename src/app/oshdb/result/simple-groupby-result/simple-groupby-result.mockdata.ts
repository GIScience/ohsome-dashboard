const simpleGroupbyResultMockInputs = {
  formValuesMock: {
    'keys': 'natural',
    'types': ['node'],
    'measure': 'count',
    'groupBy': 'boundary'
  },
  ohsomeApiSimpleGroupByResult: {
    "attribution": {
      "url": "https://ohsome.org/copyrights",
      "text": "© OpenStreetMap contributors"
    },
    "apiVersion": "1.9.0",
    "groupByResult": [
      {
        "groupByObject": "boundary1",
        "result": [
          {
            "timestamp": "2014-01-01T00:00:00Z",
            "value": 42
          },
          {
            "timestamp": "2015-01-01T00:00:00Z",
            "value": 42
          },
          {
            "timestamp": "2016-01-01T00:00:00Z",
            "value": 43
          },
          {
            "timestamp": "2017-01-01T00:00:00Z",
            "value": 43
          }
        ]
      }
    ]
  }
}

export {
  simpleGroupbyResultMockInputs
}
