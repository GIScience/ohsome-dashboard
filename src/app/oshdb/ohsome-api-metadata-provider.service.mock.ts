import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
import {ohsomeApiMetadataResponse} from './ohsome-api-metadata.response.mock';

const OhsomeApiMetadataProviderServiceMock = createSpyObj(
  'MetadataProviderService',
  [
    'loadOhsomeMetaData',
    'getOhsomeMetadataResponse'
  ]);

OhsomeApiMetadataProviderServiceMock.loadOhsomeMetaData.and.returnValue(of(ohsomeApiMetadataResponse))
OhsomeApiMetadataProviderServiceMock.getOhsomeMetadataResponse.and.returnValue(ohsomeApiMetadataResponse);

export default OhsomeApiMetadataProviderServiceMock;
