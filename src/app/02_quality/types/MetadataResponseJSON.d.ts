import {BaseResponseJSON} from './BaseResponseJSON';
import {
  RawAttributeMetadata,
  RawIndicatorMetadata,
  RawQualityDimensionMetadata,
  RawTopicMetadata
} from './types';

export interface MetadataResponseJSON extends BaseResponseJSON {
  result: MetadataResultJSON;
}

interface MetadataResultJSON {
  attributes: Record<[topicKey: string], Record<[attributeKey:string], RawAttributeMetadata>>,
  topics: { [topicKey: string]: RawTopicMetadata },
  indicators: { [indicatorKey: string]: RawIndicatorMetadata },
  qualityDimensions: {[qualityDimensionKey: string]: RawQualityDimensionMetadata},
}
