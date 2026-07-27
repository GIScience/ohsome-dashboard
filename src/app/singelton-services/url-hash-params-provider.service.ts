import {computed, effect, inject, Service, signal} from '@angular/core';
import {StateService} from './state.service';
import equal from 'fast-deep-equal/es6';

@Service()
export class UrlHashParamsProviderService {

  private relevantState = computed(() => {
    // url params from global state
    const backend = this.stateService.appState().queryMode;

    // url params from forms
    const extractionForm = structuredClone(this.stateService.extractionFormModel());
    // more form models TODO remove legacy form use quality form only
    const legacyForm = structuredClone(this.stateService.legacyFormModel()) ?? {};
    const qualityForm = structuredClone(this.stateService.qualityFormModel());

    let activeForm;
    switch (backend) {
      case "ohsomeApi":
      case "oqtApi":
        activeForm = {...qualityForm, ...legacyForm};
        break;
      case "extraction":
        activeForm = extractionForm;
    }
    if(!activeForm) {return {backend}}
    //exclude empty url params
    for (const key of Object.keys(activeForm)) {
      const value = activeForm[key];
        if (value === null || value === undefined || value === '') {
          delete activeForm[key];
        }
    }
    // exclude custom params if regular topic
    if (activeForm.topic !== 'custom-topic') {
      delete activeForm['topic-title'];
      delete activeForm['topic-filter'];
    }

    //hash params
    return {
      backend,
      ...activeForm
    }
  }, {
    equal: (a, b) => {
      return equal(a, b);

      // a.queryMode === b.queryMode
      //   // && a.topic === b.topic
      //   && a.customTopicTitle === b.customTopicTitle
      //   && a.customTopicFilter === b.customTopicFilter
    }
  });

  private stateService = inject(StateService);

  constructor() {
    console.log("UrlHashParamsProviderService constructor");
    this.initHashParamsStore()
    // this.updateHashParamsStoreFromUrl();

    effect(() => {
      this.setHashParams(this.relevantState())
    });
  }

  private readonly _currentHashParams = signal<URLSearchParams>(new URLSearchParams(), {
    equal: (a, b) => a.toString() === b.toString()
  });
  public readonly currentHashParams = this._currentHashParams.asReadonly();

  private initHashParamsStore() {
    this._currentHashParams.set(new URLSearchParams(this.stateService.initialHashParams));
  }

  getHashURLSearchParams() {
    return this._currentHashParams();
  }

  /**
   * Replaces all current params by the new ones
   * @param paramsObject
   */
  setHashParams(paramsObject) {
    console.log("XXXXXXXXX set", paramsObject)
    this._currentHashParams.update(() => new URLSearchParams(paramsObject));
    globalThis.location.hash = this._currentHashParams().toString();
  }

  /** Update only the specified params and keep all others
   * @param paramsObject
   */
  updateHashParams(paramsObject) {
    console.log("XXXXXXXXX update", paramsObject)
    const currentParams = Object.fromEntries(this._currentHashParams().entries());
    this._currentHashParams.update(() => new URLSearchParams({...currentParams, ...paramsObject}));
    globalThis.location.hash = this._currentHashParams().toString();
  }

  /** Update only the specified param and keep all others
   * @param key
   * @param value
   */
  updateHashParam(key: string, value: string) {
    console.log("XXXXXXXXX update single param", key, value);
    const currentParams = Object.fromEntries(this._currentHashParams().entries());
    this._currentHashParams.update(() => new URLSearchParams({...currentParams, [key]: value}));
    globalThis.location.hash = this._currentHashParams().toString();
  }
}
