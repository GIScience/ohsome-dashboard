import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlHashParamsProviderService {
  private _currentHashParams = signal<URLSearchParams>(new URLSearchParams(), {
    equal: (a, b) => a.toString() === b.toString()
  });
  public readonly currentHashParams = this._currentHashParams.asReadonly();

  updateHashParamsStoreFromUrl () {
    this._currentHashParams.update(()=> new URLSearchParams(window.location.hash.slice(1)));//.toLowerCase());
  }


  getHashURLSearchParams() {
    if (this._currentHashParams.length === 0) this.updateHashParamsStoreFromUrl();
    return this._currentHashParams();
  }

  updateHashParams(paramsObject){
    this._currentHashParams.update(()=> new URLSearchParams(paramsObject));
    window.location.hash = this._currentHashParams().toString();
  }

  updatePartialHashParams(paramsObject){
    const currentParams = Object.fromEntries(this.currentHashParams().entries());
    this._currentHashParams.update(()=> new URLSearchParams({...currentParams, ...paramsObject}));
    window.location.hash = this._currentHashParams().toString();
  }

  updateHashParam(key:string, value:string) {
    const currentParams = Object.fromEntries(this.currentHashParams().entries());
    this._currentHashParams.update(()=> new URLSearchParams({...currentParams, key: value}));
    window.location.hash = this._currentHashParams().toString();
  }

}
