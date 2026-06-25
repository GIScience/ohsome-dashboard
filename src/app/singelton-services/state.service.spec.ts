import {TestBed} from '@angular/core/testing';

import {StateService} from './state.service';
import {beforeEach, describe, expect, it} from "vitest";

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
        expect(service.appState().showWelcomeScreen).toBe(false);
        service.updatePartialState({ showWelcomeScreen: true });
        expect(service.appState().showWelcomeScreen).toBe(true);
    });
});
