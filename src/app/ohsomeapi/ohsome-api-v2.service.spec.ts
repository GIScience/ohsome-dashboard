import {TestBed} from '@angular/core/testing';

import {OhsomeApiV2Service} from './ohsome-api-v2.service';

import {beforeEach, describe, expect, it} from 'vitest';

describe('OhsomeApiv2Service', () => {
  let service: OhsomeApiV2Service;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OhsomeApiV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
