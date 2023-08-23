import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {OhsomeApi} from '@giscience/ohsome-js-utils';
import ResponseJSON = OhsomeApi.v1.format.ResponseJSON;

const OHSOME_API_ROOT_URL = environment.oshdbRestApiRootUrl;
const OHSOME_API_ANNOUNCEMENT_URL = environment.announcementUrl;

@Injectable()
export class OhsomeApiService {
  constructor(private http: HttpClient) {
  }

  get<T>(urlPath: string, queryParams = ''): Observable<T> {
    return this.http.get<T>(OHSOME_API_ROOT_URL + '/' + urlPath + '?' + queryParams, {responseType: 'json'});
  }

  post(urlPath: string, queryParams?: string): Observable<ResponseJSON> {
    return this.http.post<ResponseJSON>(OHSOME_API_ROOT_URL + '/' + urlPath,
      queryParams,
      {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'})});
  }

  getOhsomeApiAnnouncement() {
    return this.http.get(OHSOME_API_ANNOUNCEMENT_URL);
  }
}
