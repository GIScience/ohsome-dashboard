import {Injectable} from '@angular/core';
import {OhsomeApi} from '@giscience/ohsome-js-utils';
import {OhsomeApiService} from './ohsome-api.service';
import {catchError, Observable, of, tap} from 'rxjs';
import MetadataResponse = OhsomeApi.v1.response.MetadataResponse;


@Injectable({
  providedIn: 'root'
})
export class OhsomeApiMetadataProviderService {
  private ohsomeMetadataResponse: MetadataResponse;
  private ohsomeApiAnnouncement = '';

  constructor(private restservice: OhsomeApiService) {
  }

  public getOhsomeMetadataResponse(): MetadataResponse {
    return this.ohsomeMetadataResponse;
  }

  public hasOhsomeApiAnnouncement(): boolean {
    return this.ohsomeApiAnnouncement.trim() !== '';
  }
  public getOhsomeApiAnnouncement(): string {
    return this.ohsomeApiAnnouncement;
  }

  loadOhsomeMetadata(): Observable<MetadataResponse|{message:string}> {
    // return of(ohsomeApiMetadataResponse)
    return this.restservice.get<MetadataResponse>('metadata')
      .pipe(
        tap((response) => {
          // add custom logic here
          console.log(response);
          if (MetadataResponse.isMetadataResponseJSON(response)) {
            this.ohsomeMetadataResponse = new MetadataResponse(response);
          } else {
            alert('Server response was not a metadata response: \n\n' + JSON.stringify(response, undefined, 2));
          }
        }),
        catchError( (err) => {
          alert('Server did not respond with a metadata response: \n\n' + JSON.stringify(err, undefined, 2));
          return of({"message": 'Server did not respond with a metadata response'})
        } )
    )
  }

  loadOhsomeApiAnnouncement() {
    return this.restservice.getOhsomeApiAnnouncement()
      .pipe(
        tap(response => {
          this.ohsomeApiAnnouncement = response['Announce'] || '';
        } ),
        catchError((err, caught) => {
          console.log(err.error);
          return of({"Announce": ''})
        })
      )
  }
}
