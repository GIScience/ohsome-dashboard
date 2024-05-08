import {BaseResponseJSON} from './BaseResponseJSON';
import {RawIndicatorMetadata, RawProjectMetadata, RawQualityDimensionMetadata, RawReportMetadata, RawTopicMetadata} from './types';

export interface MetadataResponseJSON extends BaseResponseJSON {
  result: MetadataResultJSON;
}

interface MetadataResultJSON {
  topics: { [topicKey: string]: RawTopicMetadata },
  indicators: { [indicatorKey: string]: RawIndicatorMetadata },
  reports?: {[reportKey:string]: RawReportMetadata},
  qualityDimensions: {[qualityDimensionKey: string]: RawQualityDimensionMetadata},
  projects: {[projectKey:string]: RawProjectMetadata}
}
