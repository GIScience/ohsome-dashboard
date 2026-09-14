import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatsQueryFormComponent} from './stats-query-form.component';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../02_quality/oqt-api-metadata-provider.service.mock';
import {StateService} from '../../singelton-services/state.service';
import {beforeEach, describe, expect, it} from 'vitest'

describe('StatsQueryFormComponent', () => {
  let component: StatsQueryFormComponent;
  let fixture: ComponentFixture<StatsQueryFormComponent>;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsQueryFormComponent],
      providers: [
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StatsQueryFormComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('stats form validity, pushed into StateService', () => {
    it('is valid by default', () => {
      TestBed.tick();

      expect(stateService.isValidStatsForm()).toBe(true);
      expect(stateService.statsFormMessages()).toEqual([]);
    });

    it('requires an ohsome filter once the topic is switched to "custom-topic"', () => {
      stateService.statsFormModel.update((model) => ({...model, topic: 'custom-topic', 'topic-filter': ''}));
      TestBed.tick();

      expect(stateService.isValidStatsForm()).toBe(false);
      expect(stateService.statsFormMessages()).toEqual(['An ohsome filter is required.']);
    });

    it('requires a tag key once "Tag Value Exploration" is toggled on', () => {
      component.groupByTag.set(true);
      TestBed.tick();

      expect(stateService.isValidStatsForm()).toBe(false);
      expect(stateService.statsFormMessages()).toEqual([
        'A tag key is required for tag value exploration.',
      ]);
    });

    it('becomes valid again once the tag key is filled in', () => {
      component.groupByTag.set(true);
      TestBed.tick();
      expect(stateService.isValidStatsForm()).toBe(false);

      stateService.statsFormModel.update((model) => ({...model, groupByTagKey: 'building'}));
      TestBed.tick();

      expect(stateService.isValidStatsForm()).toBe(true);
      expect(stateService.statsFormMessages()).toEqual([]);
    });
  });
});
