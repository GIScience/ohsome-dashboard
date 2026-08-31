import {AOIData} from '../../shared/components/aoi-input/aoi-input.component';
import {components} from '../../ohsomeapi/ohsome-api-v2-types';

interface SharedFormData {
  topic: string;
  "topic-title": string;
  "topic-filter": string;
}

interface StatsFormData extends SharedFormData {
  aoi: AOIData;
  // time: string; //start/end/interval
  start: string;
  end: string;
  interval: string;
  measure: components['schemas']['MeasureRequestModel'];
  groupByTagKey: string;
}

interface QualityFormData extends SharedFormData {
  indicators: string[];
  adminids: string;
  measure: components['schemas']['MeasureRequestModel'];
}

interface ExtractionFormData extends SharedFormData {
  aoi: AOIData;
  clip: boolean;
  time: string;
}

export {
  SharedFormData,
  StatsFormData,
  QualityFormData,
  ExtractionFormData,
}
