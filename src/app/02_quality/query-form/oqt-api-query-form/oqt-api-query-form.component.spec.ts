import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OqtApiQueryFormComponent} from './oqt-api-query-form.component';
import {FormsModule, NgForm} from '@angular/forms';
import {provideHttpClient} from '@angular/common/http';
import {OqtApiMetadataProviderService} from '../../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../oqt-api-metadata-provider.service.mock';
import {OqtModule} from '../../oqt.module';
import {StateService} from '../../../singelton-services/state.service';
import {beforeEach, describe, expect, it} from "vitest";

describe('OqtApiQueryFormComponent', () => {
  let component: OqtApiQueryFormComponent;
  let fixture: ComponentFixture<OqtApiQueryFormComponent>;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FormsModule, OqtModule, OqtApiQueryFormComponent],
    providers: [
        NgForm,
        { provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock },
        provideHttpClient()
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(OqtApiQueryFormComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('quality form validity, pushed into StateService', () => {
    it('is valid by default, since the initial model already has an indicator selected', () => {
      TestBed.tick();

      expect(stateService.isValidQualityForm()).toBe(true);
      expect(stateService.qualityFormMessages()).toEqual([]);
    });

    it('becomes invalid, with a message, once the last indicator is removed', () => {
      stateService.qualityFormModel.update((model) => ({...model, indicators: []}));
      TestBed.tick();

      expect(stateService.isValidQualityForm()).toBe(false);
      expect(stateService.qualityFormMessages()).toEqual([
        'At least one quality indicator must be selected.',
      ]);
    });

    it('becomes valid again, with no message, once an indicator is added back', () => {
      stateService.qualityFormModel.update((model) => ({...model, indicators: []}));
      TestBed.tick();
      expect(stateService.isValidQualityForm()).toBe(false);

      stateService.qualityFormModel.update((model) => ({...model, indicators: ['mapping-saturation']}));
      TestBed.tick();

      expect(stateService.isValidQualityForm()).toBe(true);
      expect(stateService.qualityFormMessages()).toEqual([]);
    });

    it('requires an ohsome filter once the topic is switched to "custom-topic"', () => {
      component.indicators['mapping-saturation'].checked = false;
      stateService.qualityFormModel.update((model) => ({
        ...model, topic: 'custom-topic', 'topic-title': 'My custom topic', 'topic-filter': ''
      }));
      TestBed.tick();

      expect(stateService.isValidQualityForm()).toBe(false);
      expect(stateService.qualityFormMessages()).toEqual(['An ohsome filter is required.']);
    });

    it('requires a custom topic title once the topic is switched to "custom-topic"', () => {
      component.indicators['mapping-saturation'].checked = false;
      stateService.qualityFormModel.update((model) => ({
        ...model, topic: 'custom-topic', 'topic-title': '', 'topic-filter': 'building=*'
      }));
      TestBed.tick();

      expect(stateService.isValidQualityForm()).toBe(false);
      expect(stateService.qualityFormMessages()).toEqual(['A custom topic title is required.']);
    });
  });
});
