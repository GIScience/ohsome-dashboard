import {StateService} from './app/singelton-services/state.service';

export function setHashParamsFromUrl(stateService: StateService) {
  return () => {
    stateService.init()
  }
}
