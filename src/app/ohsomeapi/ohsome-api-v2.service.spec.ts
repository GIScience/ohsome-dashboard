import {TestBed} from '@angular/core/testing';

import {OhsomeApiV2Service} from './ohsome-api-v2.service';

import {beforeEach, describe, expect, it} from 'vitest';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from '../interceptors/auth.interceptor';
import {AuthService} from '../singelton-services/auth.service';
import {ApplicationInitStatus, inject, provideAppInitializer} from '@angular/core';
import {paths} from '../shared/ohsome-api-v2-types';

describe('OhsomeApiv2Service', () => {
  let service: OhsomeApiV2Service;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideAppInitializer(() => {
          const authService = inject(AuthService);
          return authService.initializeUser();
        }),
      ]
    });
    // Wait until initializeUser() has completed
    await TestBed.inject(ApplicationInitStatus).donePromise;
    service = TestBed.inject(OhsomeApiV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a features count request', async () => {
    const params: paths['/features/{measure}.json']['post']['requestBody']['content']['application/json'] = {
      filter: "type:node and natural=tree",
      timeSeries: {
        "start": "2026-01-01T00:00:00Z",
        "end": "2026-04-17T00:00:00Z",
        "interval": "P1M"
      },
      aoi:
        {
          "coordinates": [
            [
              [8.72362, 49.41582],
              [8.68812, 49.41582],
              [8.68812, 49.4039],
              [8.72362, 49.4039],
              [8.72362, 49.41582]
            ]
          ],
          "type": "Polygon"
        }
    }

    await new Promise<void>((resolve, reject) => {
      service.features('count', params).subscribe({
        next: (result) => {
          console.log('REAL RESULT', result);
        },
        error: (err) => {
          console.log('REAL ERROR', err);
          reject(err);
        },
        complete: () => {
          console.log('DONE');
          resolve();
        }
      });
    });

  });
});
