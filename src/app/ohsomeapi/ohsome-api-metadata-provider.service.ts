import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of, retry, tap, throwError} from 'rxjs';
import {OhsomeApiV2Service} from './ohsome-api-v2.service';
import {components} from './ohsome-api-v2-types';


@Injectable({
  providedIn: 'root'
})
export class OhsomeApiMetadataProviderService {
  private ohsomeApiService = inject(OhsomeApiV2Service);

  private ohsomeMetadataResponse: components['schemas']['MetadataResponseModel'];
  private ohsomeApiAnnouncement = '';
  public ohsomeApiAvailable = false;

  public getOhsomeMetadataResponse(): components['schemas']['MetadataResponseModel'] | undefined {
    return this.ohsomeMetadataResponse;
  }

  public hasOhsomeApiAnnouncement(): boolean {
    return this.ohsomeApiAnnouncement.trim() !== '';
  }

  public getOhsomeApiAnnouncement(): string {
    return this.ohsomeApiAnnouncement;
  }

  loadOhsomeMetadata(): Observable<components['schemas']['MetadataResponseModel']> {
    // return of(ohsomeApiMetadataResponse)
    return this.ohsomeApiService.metadata()
      .pipe(
        retry({count: 2, delay: 2000, resetOnSuccess: true}),
        tap((response) => {
          // add custom logic here
          this.ohsomeMetadataResponse = response;
          this.ohsomeApiAvailable = true;
        }),
        catchError((error) => {
          this.ohsomeApiAvailable = false;
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
          return throwError(
            () => new Error('The ohsome API did not respond with a metadata response as expected.')
          );
        })
      )
  }

  loadOhsomeApiAnnouncement() {
    return this.ohsomeApiService.getOhsomeApiAnnouncement()
      .pipe(
        tap(response => {
          this.ohsomeApiAnnouncement = response['Announce'] || '';
        }),
        catchError((err) => {
          console.log(err.error);
          // if we cannot retrieve the announcement, we continue with an empty message
          return of({"Announce": ''})
        })
      )
  }
}
