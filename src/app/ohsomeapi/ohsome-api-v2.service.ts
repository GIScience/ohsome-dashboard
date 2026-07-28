import {inject, Service} from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {SKIP_AUTH} from '../interceptors/skip-auth.token';
import type {paths, components} from '../shared/ohsome-api-v2-types';

const OHSOME_API_ROOT_URL = environment.ohsomeApiRootUrl;

type OhsomeApiGetMetadataResponse = paths['/metadata']['get']['responses']['200']['content']['application/json']

@Service()
export class OhsomeApiV2Service {
  private http = inject(HttpClient);
  private OHSOME_API_ANNOUNCEMENT_URL: string = environment.announcementUrl;

  metadata() {
    return this.http.get<OhsomeApiGetMetadataResponse>(
      `${OHSOME_API_ROOT_URL}/metadata`,
      {context: new HttpContext().set(SKIP_AUTH, true)});
  }

  features(
    measure: components['schemas']['MeasureRequestModel'],
    body: paths['/stats/features/{measure}.json']['post']['requestBody']['content']['application/json']
  ) {
    return this.http.post(
      `${OHSOME_API_ROOT_URL}/stats/features/${measure}.json`,
      body
    )
  }

  getOhsomeApiAnnouncement() {
    return this.http.get(this.OHSOME_API_ANNOUNCEMENT_URL);
  }
}
