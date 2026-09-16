import {AOIData} from '../../shared/components/aoi-input/aoi-input.component';
import {paths} from '../../ohsomeapi/ohsome-api-v2-types';

interface SharedFormData {
  topic: string;
  "topic-title": string;
  "topic-filter": string;
}

interface StatsFormData extends SharedFormData {
  aoi: AOIData;
  start: string;
  end: string;
  interval: string;
  measure: paths['/stats/features/{measure}.json']['post']['parameters']['path']['measure'];
  clip: boolean;
  groupByTagKey: string;
}

interface QualityFormData extends SharedFormData {
  indicators: string[];
  adminids: string;
  measure: paths['/stats/features/{measure}.json']['post']['parameters']['path']['measure'];
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
