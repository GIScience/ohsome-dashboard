import {Feature, MultiPolygon, Polygon} from 'geojson';
import * as Plotly from 'plotly.js-dist-min';
import BaseResponseJSON from './BaseResponseJSON';
import {KeyValue} from '@angular/common';

interface RawTopicMetadata {
  name: string;
  description: string;
  aggregationType: 'count' | 'length' | 'area';
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
  qualityDimension: string;
}

interface RawQualityDimensionMetadata {
  name: string;
  description: string;
  source: string | null;
}

interface Indicator extends RawIndicatorMetadata {
  key: string;
}

// parameter information from the formValues
type Params = { [paramName: string]: string | string[] | boolean }
type IndicatorParams = KeyValue<string, { "params": Params | null }>;

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
  metadata: { name: string; description: string; qualityDimension: string },
  topic: { key: string; name: string; description: string },
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
  RawQualityDimensionMetadata,
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
