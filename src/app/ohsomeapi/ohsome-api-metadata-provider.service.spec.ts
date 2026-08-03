import {beforeEach, describe, expect, it, type MockedObject, vi} from "vitest";
import {TestBed} from '@angular/core/testing';

import {OhsomeApiMetadataProviderService} from './ohsome-api-metadata-provider.service';
import {OhsomeApiV2Service} from './ohsome-api-v2.service';
import {of, throwError} from 'rxjs';
import {ohsomeApiMetadataResponse} from './ohsome-api-metadata.response.mock';
import {HttpErrorResponse} from '@angular/common/http';


describe('OhsomeApiMetadataProviderService', () => {
  let service: OhsomeApiMetadataProviderService;
  let ohsomeApiServiceSpy: MockedObject<OhsomeApiV2Service>;

  beforeEach(() => {
    const spy = {
      metadata: vi.fn().mockName("OhsomeApiService.metadata"),
      getOhsomeApiAnnouncement: vi.fn().mockName("OhsomeApiService.getOhsomeApiAnnouncement")
    };
    TestBed.configureTestingModule({
      imports: [],
      providers: [OhsomeApiMetadataProviderService, {provide: OhsomeApiV2Service, useValue: spy}]
    });
    service = TestBed.inject(OhsomeApiMetadataProviderService);
    ohsomeApiServiceSpy = TestBed.inject(OhsomeApiV2Service) as MockedObject<OhsomeApiV2Service>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load ohsome metadata successfully', () => {
    ohsomeApiServiceSpy.metadata.mockReturnValue(of(ohsomeApiMetadataResponse));

    // load metadata and set ohsomeApiAvailable to true
    service.loadOhsomeMetadata().subscribe(() => {
      expect(service.ohsomeApiAvailable).toBe(true);
    });
  });

  it('should handle ohsome metadata loading error', async () => {

    // mock ohsome api to return an error
    ohsomeApiServiceSpy.metadata.mockReturnValue(throwError(() => {
      const error = new Error('Internal Server Error');
      error['status'] = 500;
      return error;
    }));

    service.loadOhsomeMetadata().subscribe({
      error: err => {
        expect(err).toBeTruthy();
        expect(service.ohsomeApiAvailable).toBe(false);
        expect(service.getOhsomeMetadataResponse()).toBeUndefined();
      }
    });
  });

  it('should load ohsome API announcement successfully', () => {
    const announcement = {Announce: 'Hello from ohsome API!'};
    ohsomeApiServiceSpy.getOhsomeApiAnnouncement.mockReturnValue(of(announcement));

    service.loadOhsomeApiAnnouncement().subscribe(() => {
      expect(service.getOhsomeApiAnnouncement()).toEqual(announcement.Announce);
      expect(service.hasOhsomeApiAnnouncement()).toBe(true);
    });
  });

  it('should handle ohsome API announcement loading error', () => {

    // mock error from ohsome api status
    ohsomeApiServiceSpy.getOhsomeApiAnnouncement.mockReturnValue(throwError(() => {
      return new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'Test error'
      });
    }));

    service.loadOhsomeApiAnnouncement().subscribe(() => {
      expect(service.getOhsomeApiAnnouncement()).toEqual('');
      expect(service.hasOhsomeApiAnnouncement()).toBe(false);
    });

  });

});
