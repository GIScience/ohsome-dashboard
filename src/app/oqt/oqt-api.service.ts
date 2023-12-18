import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, /*of*/} from 'rxjs';
import {IndicatorResponseJSON} from './types/types';
import {environment} from '../../environments/environment';
import {BaseResponseJSON} from './types/BaseResponseJSON';
import {MetadataResponseJSON} from './types/MetadataResponseJSON';
import {FeatureCollection, MultiPolygon, Polygon} from 'geojson';
// import {oqtApiMetadataResponseMock} from './oqt-api-metadata.response.mock';
// import {indicatorResponseMock} from './result/indicator.response.mock';

const OQT_API_ROOT_URL = environment.oqtApiRootUrl;
let OQT_API_PROJECT: string;

@Injectable({
  providedIn: 'root'
})
export class OqtApiService {

  constructor(private http: HttpClient) {
    const project = null; //urlHashParamsProviderService.getHashURLSearchParams().get("project");
    OQT_API_PROJECT = project || environment.oqtApiProject || 'core';
  }

  get(urlPath: string, queryParams = ''): Observable<BaseResponseJSON> {
    return this.http.get<BaseResponseJSON>(OQT_API_ROOT_URL + '/' + urlPath + '?' + queryParams, {responseType: 'json'});
  }

  post(urlPath: string, body?: any | null): Observable<any> {
    return this.http.post<BaseResponseJSON>(OQT_API_ROOT_URL + '/' + urlPath,
      body,
      {headers: new HttpHeaders({'Content-Type': 'application/json', 'accept': 'application/json'})});
  }

  getMetadata(): Observable<MetadataResponseJSON> {
    // return of(oqtApiMetadataResponseMock);
    return this.get('metadata', `project=${OQT_API_PROJECT}`) as Observable<MetadataResponseJSON>;
  }

  getIndicator(indicatorKey, body): Observable<IndicatorResponseJSON> {
    // return of(indicatorResponseMock);
    const path = `indicators/${indicatorKey}`;
    return this.post(path, body);
  }

  getIndicatorCoverage(indicatorKey: string, inverse: boolean = false): Observable<BaseResponseJSON & FeatureCollection<Polygon|MultiPolygon>> {
    const path = `metadata/indicators/${indicatorKey}/coverage`;
    return this.get(path, `inverse=${inverse}`) as Observable<BaseResponseJSON & FeatureCollection<Polygon|MultiPolygon>>;
  }

}
