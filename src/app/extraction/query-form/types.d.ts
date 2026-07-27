interface SharedFormData {
  topic: string;
  "topic-title": string;
  "topic-filter": string;
}

interface ExtractionFormData extends SharedFormData {
  aoi: string;
  clip: boolean;
  timestamp: string;
}

interface QualityFormData extends SharedFormData {
  indicators: string[];
}

export {
  SharedFormData,
  ExtractionFormData,
  QualityFormData,
}
