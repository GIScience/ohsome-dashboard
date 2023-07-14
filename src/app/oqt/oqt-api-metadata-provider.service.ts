import {Injectable} from '@angular/core';
import {OqtApiService} from './oqt-api.service';
import {catchError, retry, tap, throwError} from 'rxjs';
import {MetadataResponseJSON} from './types/MetadataResponseJSON';

@Injectable({
  providedIn: 'root'
})
export class OqtApiMetadataProviderService {
  private oqtMetadataResponse: MetadataResponseJSON;
  public oqtApiAvailable = false;

  constructor(private oqtApi: OqtApiService) {
  }

  getOqtApiMetadata() {
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

}


