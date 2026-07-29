import {AOIData} from '../../shared/components/aoi-input/aoi-input.component';

interface SharedFormData {
  topic: string;
  "topic-title": string;
  "topic-filter": string;
}

interface ExtractionFormData extends SharedFormData {
  aoi: AOIData;
  clip: boolean;
  timestamp: string;
}

interface QualityFormData extends SharedFormData {
  indicators: string[];
  adminids: string;
}

export {
  SharedFormData,
  ExtractionFormData,
  QualityFormData,
}
