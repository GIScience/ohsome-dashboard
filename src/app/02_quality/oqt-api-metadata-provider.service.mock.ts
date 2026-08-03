import {of} from 'rxjs';
import {oqtApiMetadataResponseMock, oqtAttributesResponseMock} from './oqt-api-metadata.response.mock';
import {vi} from 'vitest';

const OqtApiMetadataProviderServiceMock = {
  'loadOqtApiMetadata': vi.fn(),
  'getOqtApiMetadata': vi.fn(),
  'getAttributes': vi.fn(),
  'getAttributeName': vi.fn(),
  'getAttributeDescription': vi.fn(),
  'getAttributeFilter': vi.fn(),
  'getTopicMeasure': vi.fn(),
  'getTopicFilter': vi.fn()
};

OqtApiMetadataProviderServiceMock.loadOqtApiMetadata.mockReturnValue(of(oqtApiMetadataResponseMock))
OqtApiMetadataProviderServiceMock.getOqtApiMetadata.mockReturnValue(oqtApiMetadataResponseMock);
OqtApiMetadataProviderServiceMock.getAttributes.mockReturnValue(oqtAttributesResponseMock);
OqtApiMetadataProviderServiceMock.getTopicMeasure.mockReturnValue('count');

export default OqtApiMetadataProviderServiceMock;

