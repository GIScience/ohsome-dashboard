import {effect, Injectable, signal} from '@angular/core';

interface StateParams {
  showWelcomeScreen: boolean;
  welcomeTab: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private initialState: StateParams = {
    showWelcomeScreen: false,
    welcomeTab: 'intro'
  };

  // Private signal to hold the current state
  private _appState = signal<StateParams>(this.initialState);

  // Public readonly signal for components to read
  public readonly appState = this._appState.asReadonly();

  constructor() {
    effect(() => {
      console.log("App state changed", this.appState());
    });
  }

  updatePartialState(partialState: Partial<StateParams>): void {
    this._appState.update(currentState => ({
      ...currentState,
      ...partialState
    }));
  }

}
