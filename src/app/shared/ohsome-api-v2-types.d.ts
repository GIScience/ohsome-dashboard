type FeaturesMeasure = 'count' | 'length' | 'area';

interface TimesSeries {
  start: string;
  end: string;
  interval?: string;
}

interface TimeSeriesParameters {
  filter: string;
  timeSeries: TimesSeries
}

export {
  FeaturesMeasure,
  TimeSeriesParameters,
}
