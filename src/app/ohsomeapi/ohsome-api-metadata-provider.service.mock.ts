import {of} from 'rxjs';
import {ohsomeApiMetadataResponse} from './ohsome-api-metadata.response.mock';
import { vi } from 'vitest';

const OhsomeApiMetadataProviderServiceMock = {
  'loadOhsomeMetaData': vi.fn(),
  'getOhsomeMetadataResponse': vi.fn(),
  'hasOhsomeApiAnnouncement': vi.fn(),
  'getOhsomeApiAnnouncement': vi.fn(),
}

OhsomeApiMetadataProviderServiceMock.loadOhsomeMetaData.mockReturnValue(of(ohsomeApiMetadataResponse));
OhsomeApiMetadataProviderServiceMock.getOhsomeMetadataResponse.mockReturnValue(ohsomeApiMetadataResponse);
OhsomeApiMetadataProviderServiceMock.hasOhsomeApiAnnouncement.mockReturnValue(true);
OhsomeApiMetadataProviderServiceMock.getOhsomeApiAnnouncement.mockReturnValue({"Announce": "Hello World"});


export default OhsomeApiMetadataProviderServiceMock;
