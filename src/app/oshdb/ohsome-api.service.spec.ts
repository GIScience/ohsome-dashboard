import {TestBed, inject} from '@angular/core/testing';

import {OhsomeApiService} from './ohsome-api.service';
import {HttpClientModule} from '@angular/common/http';

describe('RestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule],
      providers: [OhsomeApiService]
    });
  });

  it('should be created', inject([OhsomeApiService], (service: OhsomeApiService) => {
    expect(service).toBeTruthy();
  }));
});
