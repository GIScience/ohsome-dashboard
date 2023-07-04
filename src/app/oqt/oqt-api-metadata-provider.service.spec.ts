import { TestBed } from '@angular/core/testing';

import { OqtApiMetadataProviderService } from './oqt-api-metadata-provider.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('OqtMetadataProviderService', () => {
  let service: OqtApiMetadataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(OqtApiMetadataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
