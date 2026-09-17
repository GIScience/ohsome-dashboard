import {paths} from '../../ohsomeapi/ohsome-api-v2-types';
import {BBox} from 'geojson';

interface SharedFormData {
  topic: string;
  "topic-title": string;
  "topic-filter": string;
  bboxes: string;
  bpolys: string;
}

interface StatsFormData extends SharedFormData {
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
  "attribute-completeness--attributes": string[];
  "attribute-completeness--attribute-title": string;
  "attribute-completeness--attribute-filter": string;
  "land-cover-thematic-accuracy--corine_land_cover_class"?: string;
  "roads-thematic-accuracy--attribute"?: string;
}

interface ExtractionFormData extends SharedFormData {
  clip: boolean;
  time: string;
  aoi?: BBox;
}

export {
  SharedFormData,
  StatsFormData,
  QualityFormData,
  ExtractionFormData,
}
