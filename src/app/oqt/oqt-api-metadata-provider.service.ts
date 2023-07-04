import {Injectable} from '@angular/core';
import {OqtApiService} from './oqt-api.service';
import {catchError, of, tap} from 'rxjs';
import {MetadataResponseJSON} from './types/MetadataResponseJSON';

@Injectable({
  providedIn: 'root'
})
export class OqtApiMetadataProviderService {
  private oqtMetadataResponse: MetadataResponseJSON;

  constructor(private oqtApi: OqtApiService) {}

  getOqtApiMetadata() {
     return this.oqtMetadataResponse;
  }

  loadOqtApiMetadata(){
    return this.oqtApi.getMetadata()
      .pipe(
      tap(
        response => {
          console.log(response);
          // check if response contains a result
          if ('result' in response){
            this.oqtMetadataResponse = response;
          }
          else {
            alert("Ohsome Quality Analyst Service did not respond with a metadata response.");
          }
        }
      ),
      catchError(err => {
        alert("Ohsome Quality Analyst Service did not respond with a metadata response.");
        return of({"message": "Ohsome Quality Analyst Service did not respond with a metadata response."})
      } )
    );

  }

}


