import { TestBed } from '@angular/core/testing';

import { OqtApiService } from './oqt-api.service';
import {HttpClientModule} from '@angular/common/http';


describe('OqtApiServiceService', () => {
  let service: OqtApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule],
    });
    service = TestBed.inject(OqtApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
