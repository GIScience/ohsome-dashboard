import { TestBed } from '@angular/core/testing';

import { OqtApiMetadataProviderService } from './oqt-api-metadata-provider.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OqtMetadataProviderService', () => {
  let service: OqtApiMetadataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [], providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()] });
    service = TestBed.inject(OqtApiMetadataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
