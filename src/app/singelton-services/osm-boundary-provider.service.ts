import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {FeatureCollection} from 'geojson';
import {map, Observable, of} from 'rxjs';

const OHSOME_BOUNDARY_WFS_URL = environment.ohsomeBoundaryWFSUrl;

@Injectable({
  providedIn: 'root'
})
export class OsmBoundaryProviderService {

  constructor(private http: HttpClient) {
  }

  getOsmBoundariesByIds(ids: number[] | undefined): Observable<string> {
    console.log('GET BOUNDARIES', ids);
    if (ids == undefined) {
      return of('');
    }

    const idList = ids.join(',');
    const url = `${OHSOME_BOUNDARY_WFS_URL}&CQL_FILTER="id" IN (${idList})`;
    return this.http.get<FeatureCollection>(url).pipe(map(featureCollection => {
      featureCollection.features.forEach( (feature, index)=> {
        feature['id'] += '-_-' + (feature.properties?.['display_name'] || `area${index}`).replace(/ /g, '__');
      });
      return JSON.stringify(featureCollection)
    }));
  }
}
