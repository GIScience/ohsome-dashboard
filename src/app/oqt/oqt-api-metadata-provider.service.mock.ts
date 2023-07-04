import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
import {oqtApiMetadataResponseMock} from './oqt-api-metadata.response.mock';

const OqtApiMetadataProviderServiceMock = createSpyObj(
  'MetadataProviderService',
  [
    'loadOqtApiMetadata',
    'getOqtApiMetadata'
  ]);

OqtApiMetadataProviderServiceMock.loadOqtApiMetadata.and.returnValue(of(oqtApiMetadataResponseMock))
OqtApiMetadataProviderServiceMock.getOqtApiMetadata.and.returnValue(oqtApiMetadataResponseMock);

export default OqtApiMetadataProviderServiceMock;

