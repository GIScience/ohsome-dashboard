import {Feature, MultiPolygon, Polygon} from 'geojson';
import {PlotlyDataLayoutConfig} from 'plotly.js-dist-min';
import BaseResponseJSON from './BaseResponseJSON';

/**
 * topic as of oqt v0.14.2 /metadata
 */
interface RawTopicMetadata {
  name: string;
  description: string;
  project: string;
  filter: string;
  ratioFilter: string | null;
  endpoint: string;
  source: string | null;
  indicators: string[];
}

interface Topic extends RawTopicMetadata {
  key: string;
  qualityDimensions?: { [qualityDimensionKey: string]: Checkbox<Indicator>[] };
}


interface RawIndicatorMetadata {
  name: string;
  description: string;
  project: string;
  qualityDimension: string;
}

interface RawQualityDimensionMetadata {
  name: string;
  description: string;
}

interface RawProjectMetadata {
  name: string;
  description: string;
}

interface Indicator extends RawIndicatorMetadata {
  key: string;
}

interface RawReportMetadata {
  name: string;
  description: string;
  project: string;
}


type Checkbox<T> = T & {
  checked: boolean
}


type IndicatorResponseGeoJSON = BaseResponseJSON & Feature<Polygon | MultiPolygon, IndicatorProperties>;
type IndicatorResponseJSON = BaseResponseJSON & {results: IndicatorProperties[]}

type IndicatorLabel =  'green' | 'yellow' | 'red' | 'undefined';
interface IndicatorProperties {
  metadata: { name: string; description: string; projects: string[]; qualityDimension: string },
  topic: { key: string; name: string; description: string; projects: string[] },
  result: {
    description: string;
    timestampOQT: string;
    timestampOSM: string;
    value: number | null;
    label: IndicatorLabel;
    class: number | null;
    figure: PlotlyDataLayoutConfig | null;
  }
}



export {
  RawTopicMetadata,
  RawIndicatorMetadata,
  RawReportMetadata,
  RawQualityDimensionMetadata,
  RawProjectMetadata,
  Topic,
  Indicator,
  Checkbox,
  IndicatorResponseGeoJSON,
  IndicatorResponseJSON,
  IndicatorLabel,
  IndicatorProperties
};
