import { TestBed } from '@angular/core/testing';

import { UrlHashParamsProviderService } from './url-hash-params-provider.service';

describe('UrlHashParamsProviderService', () => {
  let service: UrlHashParamsProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlHashParamsProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
