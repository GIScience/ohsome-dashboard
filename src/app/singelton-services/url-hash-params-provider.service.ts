import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlHashParamsProviderService {
  private readonly _currentHashParams = signal<URLSearchParams>(new URLSearchParams(), {
    equal: (a, b) => a.toString() === b.toString()
  });
  public readonly currentHashParams = this._currentHashParams.asReadonly();

  updateHashParamsStoreFromUrl () {
    this._currentHashParams.update(()=> new URLSearchParams(globalThis.location.hash.slice(1)));//.toLowerCase());
  }


  getHashURLSearchParams() {
    if (this._currentHashParams.length === 0) this.updateHashParamsStoreFromUrl();
    return this._currentHashParams();
  }

  /**
   * Replaces all current params by the new ones
   * @param paramsObject
   */
  setHashParams(paramsObject){
    this._currentHashParams.update(()=> new URLSearchParams(paramsObject));
    globalThis.location.hash = this._currentHashParams().toString();
  }

  /** Update only the specified params and keep all others
   * @param paramsObject
   */
  updateHashParams(paramsObject){
    const currentParams = Object.fromEntries(this._currentHashParams().entries());
    this._currentHashParams.update(()=> new URLSearchParams({...currentParams, ...paramsObject}));
    globalThis.location.hash = this._currentHashParams().toString();
  }

  /** Update only the specified param and keep all others
   * @param key
   * @param value
   */
  updateHashParam(key:string, value:string) {
    const currentParams = Object.fromEntries(this._currentHashParams().entries());
    this._currentHashParams.update(()=> new URLSearchParams({...currentParams, [key]: value}));
    globalThis.location.hash = this._currentHashParams().toString();
  }

}
