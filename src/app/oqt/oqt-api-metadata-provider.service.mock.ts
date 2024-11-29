import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
import {oqtApiMetadataResponseMock, oqtAttributesResponseMock} from './oqt-api-metadata.response.mock';

const OqtApiMetadataProviderServiceMock = createSpyObj(
  'MetadataProviderService',
  [
    'loadOqtApiMetadata',
    'getOqtApiMetadata',
    'getAttributes',
    'getAttributeFilter',
  ]);

OqtApiMetadataProviderServiceMock.loadOqtApiMetadata.and.returnValue(of(oqtApiMetadataResponseMock))
OqtApiMetadataProviderServiceMock.getOqtApiMetadata.and.returnValue(oqtApiMetadataResponseMock);
OqtApiMetadataProviderServiceMock.getAttributes.and.returnValue(oqtAttributesResponseMock);

export default OqtApiMetadataProviderServiceMock;

