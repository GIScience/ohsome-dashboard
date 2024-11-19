import {Feature, MultiPolygon, Polygon} from 'geojson';
import * as Plotly from 'plotly.js-dist-min';
import BaseResponseJSON from './BaseResponseJSON';
import {KeyValue} from '@angular/common';

/**
 * topic as of oqt v0.14.2 /metadata
 */
interface RawTopicMetadata {
  name: string;
  description: string;
  endpoint: string;
  aggregationType: string;
  projects: string[];
  filter: string;
  ratioFilter?: string | null;
  source: string | null;
  indicators: string[];
}

interface OqtAttribute {
  filter: string;
  name: string;
  description: string;
}

interface Topic extends RawTopicMetadata {
  key: string;
  qualityDimensions?: { [qualityDimensionKey: string]: Checkbox<Indicator>[] };
}


interface RawIndicatorMetadata {
  name: string;
  description: string;
  projects: string[];
  qualityDimension: string;
}

interface RawQualityDimensionMetadata {
  name: string;
  description: string;
  source: string | null;
}

interface RawProjectMetadata {
  name: string;
  description: string;
}

interface Indicator extends RawIndicatorMetadata {
  key: string;
}

// parameter information from the formValues
type Params = { [paramName: string]: string | string[] | boolean } | null
type IndicatorParams = KeyValue<string, { "params": Params }>;

interface RawReportMetadata {
  name: string;
  description: string;
  project: string;
}

interface RawAttributeMetadata {
  name: string,
  description: string;
  filter: string;
}


type Checkbox<T> = T & {
  checked: boolean
}


type IndicatorResponseGeoJSON = BaseResponseJSON & Feature<Polygon | MultiPolygon, IndicatorProperties>;
type IndicatorResponseJSON = BaseResponseJSON & { result: IndicatorProperties[] }
type AttributeResponseJSON = BaseResponseJSON & { result: Record<string, Record<string, OqtAttribute>> }

type IndicatorLabel = 'green' | 'yellow' | 'red' | 'undefined';

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
    figure: Plotly.PlotlyDataLayoutConfig | null;
  }
}


export {
  RawTopicMetadata,
  RawIndicatorMetadata,
  RawReportMetadata,
  RawQualityDimensionMetadata,
  RawProjectMetadata,
  RawAttributeMetadata,
  Topic,
  Indicator,
  Checkbox,
  IndicatorResponseGeoJSON,
  IndicatorResponseJSON,
  IndicatorLabel,
  IndicatorProperties,
  OqtAttribute,
  AttributeResponseJSON,
  IndicatorParams,
  Params
};
