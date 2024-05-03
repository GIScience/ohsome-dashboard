import {Injectable} from '@angular/core';
import {OqtApiService} from './oqt-api.service';
import {catchError, firstValueFrom, retry, tap, throwError} from 'rxjs';
import {MetadataResponseJSON} from './types/MetadataResponseJSON';
import {Userlayer} from '../shared/shared-types';

@Injectable({
  providedIn: 'root'
})
export class OqtApiMetadataProviderService {
  private oqtMetadataResponse: MetadataResponseJSON;
  public oqtApiAvailable = false;

  constructor(private oqtApi: OqtApiService) {
  }

  getOqtApiMetadata(): MetadataResponseJSON {
    return this.oqtMetadataResponse;
  }

  loadOqtApiMetadata() {
    return this.oqtApi.getMetadata()
      .pipe(
        retry(3),
        tap(
          response => {
            console.log(response);
            // check if response contains a result
            if ('result' in response) {
              this.oqtMetadataResponse = response;
              this.oqtApiAvailable = true;
            } else {
              this.oqtApiAvailable = false;
            }
          }
        ),
        catchError(error => {
          this.oqtApiAvailable = false;
          if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
              `Backend returned code ${error.status}, body was: `, error.error);
          }
          // Return an observable with a user-facing error message.
          return throwError(() => new Error('Ohsome Quality Analyst Service did not respond with a metadata response.'));
        })
      );

  }


  private cachedData: Record<string, Promise<Userlayer>> = {}; // Initialize the cache as empty
  async getIndicatorCoverage(indicatorKey: string): Promise<Userlayer> {

    if (!(indicatorKey in this.cachedData)) {
      // Start a new download only if no download is in progress
      this.cachedData[indicatorKey] = (async () => {
        try {
          const coverageGeoJSON = await firstValueFrom(this.oqtApi.getIndicatorCoverage(indicatorKey,true));
          // fill cache
          this.cachedData[indicatorKey] = Promise.resolve(Object.freeze({
            name: indicatorKey,
            title: `Coverage of reference data`,
            data: coverageGeoJSON,
            style: {color: '#000', stroke: false}
          }) as Userlayer);

          return this.cachedData[indicatorKey];
        } catch (error) {
          console.error('Error downloading file:', error);
          throw error;
        }
      })();
    }

    // Return the cached data
    return this.cachedData[indicatorKey];
  }

}


