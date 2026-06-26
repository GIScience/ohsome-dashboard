import {inject, TestBed} from '@angular/core/testing';
import {DataService} from './data.service';
import {beforeEach, describe, expect, it} from "vitest";


describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
});
