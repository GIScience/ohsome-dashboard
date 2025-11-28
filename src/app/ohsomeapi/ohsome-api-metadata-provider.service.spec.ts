import {TestBed} from '@angular/core/testing';

import {OhsomeApiMetadataProviderService} from './ohsome-api-metadata-provider.service';
import {OhsomeApiService} from './ohsome-api.service';
import {OhsomeApi} from '@giscience/ohsome-js-utils';
import {of, throwError} from 'rxjs';
import {ohsomeApiMetadataResponse} from './ohsome-api-metadata.response.mock';
import {HttpErrorResponse} from '@angular/common/http';

describe('OhsomeApiMetadataProviderService', () => {
  let service: OhsomeApiMetadataProviderService;
  let ohsomeApiServiceSpy: jasmine.SpyObj<OhsomeApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('OhsomeApiService', ['get', 'getOhsomeApiAnnouncement']);
    TestBed.configureTestingModule({
      imports: [],
      providers: [OhsomeApiMetadataProviderService, {provide: OhsomeApiService, useValue: spy}]
    });
    service = TestBed.inject(OhsomeApiMetadataProviderService);
    ohsomeApiServiceSpy = TestBed.inject(OhsomeApiService) as jasmine.SpyObj<OhsomeApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load ohsome metadata successfully', () => {
    ohsomeApiServiceSpy.get.and.returnValue(of(ohsomeApiMetadataResponse));

    // load metadata and set ohsomeApiAvailable to true
    service.loadOhsomeMetadata().subscribe(response => {
      expect(OhsomeApi.v1.response.MetadataResponse.isMetadataResponseJSON(response)).toBeTrue();
      expect(service.ohsomeApiAvailable).toBeTrue();
    });
  })

  it('should handle invalid response', () => {
    ohsomeApiServiceSpy.get.and.returnValue(of({"not": "a valid metadata response object"}));

    service.loadOhsomeMetadata().subscribe(response => {
      expect(OhsomeApi.v1.response.MetadataResponse.isMetadataResponseJSON(response)).toBeFalse();
      expect(service.ohsomeApiAvailable).toBeFalse();
    });
  })

  it('should handle ohsome metadata loading error', (done: DoneFn) => {

    // mock ohsome api to return an error
    ohsomeApiServiceSpy.get.and.returnValue(
      throwError(
        () => {
          const error = new Error('Internal Server Error');
          error['status'] = 500;
          return error;
        }
      )
    );

    service.loadOhsomeMetadata().subscribe({
      error: err => {
        expect(err).toBeTruthy();
        expect(service.ohsomeApiAvailable).toBeFalse();
        expect(service.getOhsomeMetadataResponse()).toBeUndefined();
        done();
      }
    });
  });

  it('should load ohsome API announcement successfully', () => {
    const announcement = {Announce: 'Hello from ohsome API!'};
    ohsomeApiServiceSpy.getOhsomeApiAnnouncement.and.returnValue(of(announcement));

    service.loadOhsomeApiAnnouncement().subscribe(() => {
      expect(service.getOhsomeApiAnnouncement()).toEqual(announcement.Announce);
      expect(service.hasOhsomeApiAnnouncement()).toBeTrue();
    });
  });

  it('should handle ohsome API announcement loading error', () => {

    // mock error from ohsome api status
    ohsomeApiServiceSpy.getOhsomeApiAnnouncement.and.returnValue(
      throwError(
        () => {
          return new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
            error: 'Test error'
          });
        }
      )
    );

    service.loadOhsomeApiAnnouncement().subscribe(() => {
      expect(service.getOhsomeApiAnnouncement()).toEqual('');
      expect(service.hasOhsomeApiAnnouncement()).toBeFalse();
    });

  });

});
