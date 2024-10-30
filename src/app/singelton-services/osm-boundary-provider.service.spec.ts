import { TestBed } from '@angular/core/testing';

import { OsmBoundaryProviderService } from './osm-boundary-provider.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OsmBoundaryServiceService', () => {
  let service: OsmBoundaryProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(OsmBoundaryProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
