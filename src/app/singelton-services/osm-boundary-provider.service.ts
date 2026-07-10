import { Injectable, inject } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpContext} from '@angular/common/http';
import {FeatureCollection} from 'geojson';
import {map, Observable, of} from 'rxjs';
import {SKIP_AUTH} from '../interceptors/skip-auth.token';

const OHSOME_BOUNDARY_WFS_URL = environment.ohsomeBoundaryWFSUrl;

@Injectable({
  providedIn: 'root'
})
export class OsmBoundaryProviderService {
  private http = inject(HttpClient);

  getOsmBoundariesByIds(ids: number[] | undefined): Observable<string> {
    console.log('GET BOUNDARIES', ids);
    if (ids == undefined) {
      return of('');
    }

    const idList = ids.join(',');
    const url = `${OHSOME_BOUNDARY_WFS_URL}&CQL_FILTER="id" IN (${idList})`;
    return this.http.get<FeatureCollection>(url,{
      context: new HttpContext().set(SKIP_AUTH, true)
    }).pipe(map(featureCollection => {
      featureCollection.features.forEach( (feature, index)=> {
        feature['id'] += '-_-' + (feature.properties?.['display_name'] || `area${index}`).replace(/ /g, '__');
      });
      return JSON.stringify(featureCollection)
    }));
  }
}
