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

    describe('isValidCurrentForm', () => {
        it('reflects isValidStatsForm while on the ohsomeApi tab', () => {
            service.updatePartialState({ queryMode: 'ohsomeApi' });
            service.isValidStatsForm.set(true);
            service.isValidExtractionForm.set(false);
            service.isValidQualityForm.set(false);

            expect(service.isValidCurrentForm()).toBe(true);
        });

        it('reflects isValidExtractionForm while on the extraction tab', () => {
            service.updatePartialState({ queryMode: 'extraction' });
            service.isValidStatsForm.set(false);
            service.isValidExtractionForm.set(true);

            expect(service.isValidCurrentForm()).toBe(true);
        });

        it('reflects isValidQualityForm while on the oqtApi tab', () => {
            service.updatePartialState({ queryMode: 'oqtApi' });
            service.isValidStatsForm.set(false);
            service.isValidQualityForm.set(true);

            expect(service.isValidCurrentForm()).toBe(true);
        });

        it('recomputes when the underlying validity signal changes after the tab is already active', () => {
            service.updatePartialState({ queryMode: 'oqtApi' });
            service.isValidQualityForm.set(false);
            expect(service.isValidCurrentForm()).toBe(false);

            service.isValidQualityForm.set(true);
            expect(service.isValidCurrentForm()).toBe(true);
        });
    });

    describe('currentFormMessages', () => {
        it('returns only the active tab\'s messages, ignoring the other two', () => {
            service.updatePartialState({ queryMode: 'extraction' });
            service.statsFormMessages.set(['stats message']);
            service.extractionFormMessages.set(['extraction message']);
            service.qualityFormMessages.set(['quality message']);

            expect(service.currentFormMessages()).toEqual(['extraction message']);
        });

        it('switches which messages it returns when the active tab changes', () => {
            service.statsFormMessages.set(['stats message']);
            service.qualityFormMessages.set(['quality message']);

            service.updatePartialState({ queryMode: 'ohsomeApi' });
            expect(service.currentFormMessages()).toEqual(['stats message']);

            service.updatePartialState({ queryMode: 'oqtApi' });
            expect(service.currentFormMessages()).toEqual(['quality message']);
        });
    });
});
