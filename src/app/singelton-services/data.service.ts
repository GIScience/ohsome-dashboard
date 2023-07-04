import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {BoundaryType} from '../shared-types';

type FormData = { formValues: any, boundaryType: BoundaryType };

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private formValueSource = new Subject<FormData>();
  public currentFormValues: Observable<FormData> = this.formValueSource.asObservable();

  pushFormValues(formValues, boundaryType: BoundaryType) {
    this.formValueSource.next({
      formValues,
      boundaryType
    });
  }
}
