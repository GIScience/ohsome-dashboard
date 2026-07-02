import {TestBed} from '@angular/core/testing';

import {OsmBoundaryProviderService} from './osm-boundary-provider.service';
import {provideHttpClient} from '@angular/common/http';
import {beforeEach, describe, expect, it} from "vitest";

describe('OsmBoundaryServiceService', () => {
  let service: OsmBoundaryProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient()]
});
    service = TestBed.inject(OsmBoundaryProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
