import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
import {ohsomeApiMetadataResponse} from './ohsome-api-metadata.response.mock';

const OhsomeApiMetadataProviderServiceMock = createSpyObj(
  'MetadataProviderService',
  [
    'loadOhsomeMetaData',
    'getOhsomeMetadataResponse',
    'hasOhsomeApiAnnouncement',
    'getOhsomeApiAnnouncement'
  ]);

OhsomeApiMetadataProviderServiceMock.loadOhsomeMetaData.and.returnValue(of(ohsomeApiMetadataResponse))
OhsomeApiMetadataProviderServiceMock.getOhsomeMetadataResponse.and.returnValue(ohsomeApiMetadataResponse);
OhsomeApiMetadataProviderServiceMock.hasOhsomeApiAnnouncement.and.returnValue(true);
OhsomeApiMetadataProviderServiceMock.getOhsomeApiAnnouncement.and.returnValue({"Announce": "Hello World"});


export default OhsomeApiMetadataProviderServiceMock;
