import { TestBed } from '@angular/core/testing';

import { StateService } from './state.service';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to update the state', () => {
    service.updatePartialState({ showWelcomeScreen: false });
    expect(service.appState().showWelcomeScreen).toBeFalse();
    service.updatePartialState({ showWelcomeScreen: true });
    expect(service.appState().showWelcomeScreen).toBeTrue();
  })
});
