import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExtractionQueryFormComponent} from './extraction-query-form.component';

import {beforeEach, describe, expect, it} from 'vitest';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../02_quality/oqt-api-metadata-provider.service.mock';
import {StateService} from '../../singelton-services/state.service';
import {AuthService} from '../../singelton-services/auth.service';

describe('ExtractionQueryFormComponent', () => {
  let component: ExtractionQueryFormComponent;
  let fixture: ComponentFixture<ExtractionQueryFormComponent>;
  let stateService: StateService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtractionQueryFormComponent],
      providers: [
        { provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExtractionQueryFormComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('extraction form validity, pushed into StateService', () => {
    it('requires sign-in by default, since a fresh session is anonymous', () => {
      TestBed.tick();

      expect(stateService.isValidExtractionForm()).toBe(false);
      expect(stateService.extractionFormMessages()).toEqual(['You need to be signed in.']);
    });

    it('is valid once signed in, with the default topic', () => {
      authService.isAnon.set(false);
      TestBed.tick();

      expect(stateService.isValidExtractionForm()).toBe(true);
      expect(stateService.extractionFormMessages()).toEqual([]);
    });

    it('requires an ohsome filter once the topic is switched to "custom-topic", even when signed in', () => {
      authService.isAnon.set(false);
      stateService.extractionFormModel.update((model) => ({...model, topic: 'custom-topic', 'topic-filter': ''}));
      TestBed.tick();

      expect(stateService.isValidExtractionForm()).toBe(false);
      expect(stateService.extractionFormMessages()).toEqual(['An ohsome filter is required.']);
    });

    it('reports both problems at once when anonymous AND missing the custom filter', () => {
      stateService.extractionFormModel.update((model) => ({...model, topic: 'custom-topic', 'topic-filter': ''}));
      TestBed.tick();

      expect(stateService.isValidExtractionForm()).toBe(false);
      expect([...stateService.extractionFormMessages()].sort()).toEqual([
        'An ohsome filter is required.',
        'You need to be signed in.',
      ].sort());
    });
  });
});
