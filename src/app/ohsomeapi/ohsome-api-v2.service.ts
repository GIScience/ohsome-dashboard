import {inject, Service} from '@angular/core';
import {HttpClient, HttpContext, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {SKIP_AUTH} from '../interceptors/skip-auth.token';
import type {paths, components, operations} from './ohsome-api-v2-types';
import {catchError, throwError} from 'rxjs';
// import {of} from 'rxjs';
// import {ohsomeApiMetadataResponse} from './ohsome-api-metadata.response.mock';

const OHSOME_API_ROOT_URL = environment.ohsomeApiRootUrl;

type OhsomeApiGetMetadataResponse = paths['/metadata']['get']['responses']['200']['content']['application/json']

type FeaturesOperation = operations['post_features_as_json_stats_features__measure__json_post'];
export type FeaturesRequestBody = FeaturesOperation['requestBody']['content']['application/json'];
export type FeaturesResponse    = FeaturesOperation['responses'][200]['content']['application/json'];
export type FeaturesValidationError = FeaturesOperation['responses'][422]['content']['application/json'];
export type FeaturesError =
  | { kind: 'validation'; error: FeaturesValidationError }
  | { kind: 'http'; error: HttpErrorResponse };


@Service()
export class OhsomeApiV2Service {
  private http = inject(HttpClient);
  private OHSOME_API_ANNOUNCEMENT_URL: string = environment.announcementUrl;

  metadata() {
    // return of(ohsomeApiMetadataResponse);
    return this.http.get<OhsomeApiGetMetadataResponse>(
      `${OHSOME_API_ROOT_URL}/metadata`,
      {context: new HttpContext().set(SKIP_AUTH, true)});
  }

  features(
    measure: components['schemas']['MeasureRequestModel'],
    body: paths['/stats/features/{measure}.json']['post']['requestBody']['content']['application/json']
  ) {
    return this.http.post<FeaturesResponse>(
      `${OHSOME_API_ROOT_URL}/stats/features/${measure}.json`,
      body
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        let featuresError: FeaturesError;
        switch (err.status) {
          case 422:
            featuresError = {kind: 'validation', error: err.error as FeaturesValidationError};
            break
          default:
            featuresError = { kind: 'http', error: err };
        }
        return throwError(() => featuresError);
      })
    );
  }

  getOhsomeApiAnnouncement() {
    return this.http.get(this.OHSOME_API_ANNOUNCEMENT_URL);
  }
}
