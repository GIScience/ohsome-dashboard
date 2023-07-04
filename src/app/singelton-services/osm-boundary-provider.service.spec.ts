import { TestBed } from '@angular/core/testing';

import { OsmBoundaryProviderService } from './osm-boundary-provider.service';
import {HttpClientModule} from '@angular/common/http';

describe('OsmBoundaryServiceService', () => {
  let service: OsmBoundaryProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(OsmBoundaryProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
