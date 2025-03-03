import {Injectable} from '@angular/core';
import {OqtApiService} from './oqt-api.service';
import {catchError, firstValueFrom, retry, tap, throwError} from 'rxjs';
import {MetadataResponseJSON} from './types/MetadataResponseJSON';
import {Userlayer} from '../shared/shared-types';
import {AttributeResponseJSON } from './types/types';

@Injectable({
  providedIn: 'root'
})
export class OqtApiMetadataProviderService {
  oqtMetadataResponse: MetadataResponseJSON;
  oqtAttributes: AttributeResponseJSON;
  public oqtApiAvailable = false;

  constructor(private oqtApi: OqtApiService) {
  }

  getOqtApiMetadata(): MetadataResponseJSON {
    return this.oqtMetadataResponse;
  }

  getAttributes(): AttributeResponseJSON {
    return this.oqtAttributes;
  }

  /**
   * Return the name string of an attribute if the topic-attribute combination is defined otherwise return empty string
   */
  getAttributeName(topicKey: string, attributeKey: string): string | undefined {
    return this.oqtAttributes.result[topicKey]?.[attributeKey]?.name;
  }

  /**
   * Return the attribute string of an attribute if the topic-attribute combination is defined otherwise return empty string
   */
  getAttributeDescription(topicKey: string, attributeKey: string): string | undefined {
    return this.oqtAttributes.result[topicKey]?.[attributeKey]?.description;
  }

  /**
   * Return the filter string of an attribute if the topic-attribute combination is defined otherwise return empty string
   */
  getAttributeFilter(topicKey: string, attributeKey: string): string | undefined {
    return this.oqtAttributes.result[topicKey]?.[attributeKey]?.filter;
  }

  loadOqtApiMetadata() {
    return this.oqtApi.getMetadata()
      .pipe(
        retry(3),
        tap(
          response => {
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

  loadAttributes() {
    return this.oqtApi.getAttributes()
      .pipe(
        retry(3),
        tap(
          response => {
            // check if response contains a result
            if ('result' in response) {
              this.oqtAttributes = response;
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

  cachedData: Record<string, Promise<Userlayer>> = {}; // Initialize the cache as empty
  async getIndicatorCoverage(indicatorKey: string): Promise<Userlayer> {

    if (!(indicatorKey in this.cachedData)) {
      // Start a new download only if no download is in progress
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
    }

    // Return the cached data
    return this.cachedData[indicatorKey];
  }

}


