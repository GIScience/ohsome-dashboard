import {TestBed, inject} from '@angular/core/testing';

import {OhsomeApiMetadataProviderService} from './ohsome-api-metadata-provider.service';
import {OhsomeApiService} from './ohsome-api.service';
import {HttpClientModule} from '@angular/common/http';

describe('MetadataProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [OhsomeApiMetadataProviderService, OhsomeApiService]
    });
  });

  it('should be created', inject([OhsomeApiMetadataProviderService], (service: OhsomeApiMetadataProviderService) => {
    expect(service).toBeTruthy();
  }));
});
