import {inject, Service} from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {SKIP_AUTH} from '../interceptors/skip-auth.token';
import type {paths, components} from '../shared/ohsome-api-v2-types';

const OHSOME_API_ROOT_URL = environment.ohsomeApiRootUrl;

@Service()
export class OhsomeApiV2Service {
  private http = inject(HttpClient);

  metadata() {
    return this.http.get(
      `${OHSOME_API_ROOT_URL}/metadata`,
      {context: new HttpContext().set(SKIP_AUTH, true)})
  }

  features(
    measure: components['schemas']['MeasureRequestModel'],
    body: paths['/features/{measure}.json']['post']['requestBody']['content']['application/json']
  ) {
    return this.http.post(
      `${OHSOME_API_ROOT_URL}/features/${measure}.json`,
      body
    )
  }
}
