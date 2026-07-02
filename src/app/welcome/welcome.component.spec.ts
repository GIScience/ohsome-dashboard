import {beforeEach, describe, expect, it, vi, type Mock} from "vitest";
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WelcomeComponent} from './welcome.component';
import {provideHttpClient} from '@angular/common/http';
import {OqtApiMetadataProviderService} from '../oqapi/oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../oqapi/oqt-api-metadata-provider.service.mock';
import {oqtApiMetadataResponseMock} from '../oqapi/oqt-api-metadata.response.mock';
import {UrlHashParamsProviderService} from '../singelton-services/url-hash-params-provider.service';
import UrlHashParamsProviderServiceMock from '../singelton-services/url-hash-params-provider.service.mock';
import Utils from '../../utils';
import {Tabulator} from 'tabulator-tables';
import {StateService} from '../singelton-services/state.service';

declare const $: any;

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;


  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [
        provideHttpClient(),
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock},
        {provide: UrlHashParamsProviderService, useValue: UrlHashParamsProviderServiceMock},
        {provide: StateService},
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createColumnDefinitions', () => {
    it('should create grouped column definitions from metadata', () => {

      const defs = component.createColumnDefinitions();
      // Column Groups are the QualityDimensions

      expect(defs.length).toBeGreaterThan(0);
      expect(defs[0].title).toBeDefined();
      expect(defs[0].columns?.[0].title).toBeDefined();
      expect(defs[0].columns?.[0].field).toBeDefined();
    });
  });

  describe('createData', () => {
    it('should create topic data array with id and topic', () => {

      const topics = oqtApiMetadataResponseMock.result.topics;

      const data = component.createData();
      expect(data.length).toBe(Object.keys(topics).length);
      expect(data[0].id).toBeDefined();
      expect(data[1].topic).toBeDefined();
    });
  });

  describe('linkTo', () => {
    it('should update hash params and hide modal', () => {
      vi.spyOn($.fn, 'modal').mockReturnValue(undefined);

      component.linkTo('oqtApi');
      expect(UrlHashParamsProviderServiceMock.setHashParams).toHaveBeenCalledWith({backend: 'oqtApi'});
      expect($('#welcome').modal).toHaveBeenCalledWith('hide');
    });
  });

  describe('createTopicIndicatorMatrix', () => {
    it('should initialize Tabulator', async () => {

      // after component creation switch to tab 'topicCatalog'
      component.stateService.updatePartialState({welcomeTab: 'topicCatalog'});

      await Utils.wait(2000);

      expect(component.topicIndicatorMatrix).toBeInstanceOf(Tabulator);

    });
  });

  describe('rowClick handler', () => {
    // prepare
    const fakeRow = {
      getData: () => ({id: 'TOPIC_123'})
    } as any; // cast to satisfy RowComponent
    const fakeEvent = {} as UIEvent;
    beforeEach(() => {
      (component as any).urlHashParamsService.updateHashParams.mockClear();
      (component as any).urlHashParamsService.setHashParams.mockClear();
    });

    it('should update urlHashParams for backend oqtApi', () => {

      //prepare current form tab is oqtApi
      ((component as any).urlHashParamsService.getHashURLSearchParams as Mock).mockReturnValue(new URLSearchParams({backend: 'oqtApi'}));

      // execute test
      component.onTopicCatalogRowClick(fakeEvent, fakeRow);

      //evaluate
      // if current form is based on backend=oqtApi, DO preserve other params when switching to oqapi topic
      expect((component as any).urlHashParamsService.updateHashParams).toHaveBeenCalledWith({
        backend: 'oqtApi',
        topic: 'TOPIC_123'
      });
      expect((component as any).urlHashParamsService.setHashParams).not.toHaveBeenCalled();

    });

    it('should set urlHashParams for backend ohsomeApi', () => {

      //prepare current form tab is ohsomeApi
      ((component as any).urlHashParamsService.getHashURLSearchParams as Mock).mockReturnValue(new URLSearchParams({backend: 'ohsomeApi'}));

      // execute test
      component.onTopicCatalogRowClick(fakeEvent, fakeRow);

      //evaluate
      // if current form is based on backend=ohsomeApi, DO NOT preserve other params when switching to oqapi topic
      expect((component as any).urlHashParamsService.setHashParams).toHaveBeenCalledWith({
        backend: 'oqtApi',
        topic: 'TOPIC_123'
      });
      expect((component as any).urlHashParamsService.updateHashParams).not.toHaveBeenCalled();

    });

  });


});
