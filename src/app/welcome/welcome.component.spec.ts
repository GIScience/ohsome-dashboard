import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WelcomeComponent} from './welcome.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {OqtApiMetadataProviderService} from '../oqt/oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../oqt/oqt-api-metadata-provider.service.mock';
import {oqtApiMetadataResponseMock} from '../oqt/oqt-api-metadata.response.mock';
import {UrlHashParamsProviderService} from '../singelton-services/url-hash-params-provider.service';
import UrlHashParamsProviderServiceMock from '../singelton-services/url-hash-params-provider.service.mock';
import Utils from '../../utils';

declare const $: any;

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;


  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock},
        {provide: UrlHashParamsProviderService, useValue: UrlHashParamsProviderServiceMock},
      ]
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

      const qualityDimensions = oqtApiMetadataResponseMock.result.qualityDimensions;

      const defs = component.createColumnDefinitions();
      // Column Groups are the QualityDimensions

      // length corresponds to number of quality dimensions in oqtMetadata response
      expect(defs.length).toBe(Object.keys(qualityDimensions).length);
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
      spyOn($.fn, 'modal');

      component.linkTo('oqtApi');
      expect(UrlHashParamsProviderServiceMock.updateHashParams).toHaveBeenCalledWith({ backend: 'oqtApi' });
      expect($('#welcome').modal).toHaveBeenCalledWith('hide');
    });
  });

  describe('createTopicIndicatorMatrix', () => {
    it('should initialize Tabulator and attach rowClick handler', async () => {
      component['tabContentElementsHeight'] = 200;
      component.createTopicIndicatorMatrix();

      // wait for the DOM to be updated
      await Utils.wait(1000);

      const tabulatorElement = document.querySelector<HTMLDivElement>('#topicTable')!;

      // instantiation of Tabulator adds class to element
      expect(tabulatorElement.classList.contains('tabulator')).toBeTrue()
    });
  });


});
