import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlHashParamsProviderService {
  private currentHashParams: URLSearchParams;

  updateHashParamsStoreFromUrl () {
    this.currentHashParams = new URLSearchParams(window.location.hash.slice(1));//.toLowerCase());
  }

  getHashURLSearchParams() {
    if (!this.currentHashParams) this.updateHashParamsStoreFromUrl();
    return new URLSearchParams(this.currentHashParams);
  }

  updateHashParams(paramsObject){
    this.currentHashParams = new URLSearchParams(paramsObject);
    window.location.hash = this.currentHashParams.toString();
  }

}
