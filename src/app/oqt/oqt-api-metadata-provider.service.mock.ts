import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
import {oqtApiMetadataResponseMock, oqtAttributesResponseMock} from './oqt-api-metadata.response.mock';
import {OqtApiMetadataProviderService} from './oqt-api-metadata-provider.service';

const OqtApiMetadataProviderServiceMock: jasmine.SpyObj<OqtApiMetadataProviderService> = createSpyObj(
  'MetadataProviderService',
  [
    'loadOqtApiMetadata',
    'getOqtApiMetadata',
    'getAttributes',
    'getAttributeName',
    'getAttributeDescription',
    'getAttributeFilter',
  ]);

OqtApiMetadataProviderServiceMock.loadOqtApiMetadata.and.returnValue(of(oqtApiMetadataResponseMock))
OqtApiMetadataProviderServiceMock.getOqtApiMetadata.and.returnValue(oqtApiMetadataResponseMock);
OqtApiMetadataProviderServiceMock.getAttributes.and.returnValue(oqtAttributesResponseMock);

export default OqtApiMetadataProviderServiceMock;

