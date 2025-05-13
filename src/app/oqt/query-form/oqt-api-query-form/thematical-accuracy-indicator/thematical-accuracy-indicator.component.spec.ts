import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ThematicalAccuracyIndicatorComponent} from './thematical-accuracy-indicator.component';
import {OqtModule} from '../../../oqt.module';
import {OqtApiMetadataProviderService} from '../../../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../../oqt-api-metadata-provider.service.mock';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { provideAppInitializer } from '@angular/core';
import {preparePrismToRenderOhsomeFilterLangauge} from '../../../../app.module';
import {PrismEditorComponent} from '../../../../shared/components/prism-editor/prism-editor.component';


describe('ThematicalAccuracyIndicatorComponent', () => {
  let component: ThematicalAccuracyIndicatorComponent;
  let fixture: ComponentFixture<ThematicalAccuracyIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OqtModule, PrismEditorComponent],
      providers: [
        NgForm,
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock},
        provideAppInitializer(() => {
          const initializerFn = (preparePrismToRenderOhsomeFilterLangauge)();
          return initializerFn();
        }),
        provideHttpClient(withInterceptorsFromDi())
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ThematicalAccuracyIndicatorComponent);
    component = fixture.componentInstance;
    component.indicatorKey = "land-cover-thematic-accuracy";
    component.hashParams = new URLSearchParams("land-cover-thematic-accuracy--corine_class=11");
    component.selectedCorineClassIds = '11';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('getCorineClassFromUrlHashParams(hashParams)', () => {
    const hashParamsCases = [
      {
        description: 'Valid corine class',
        topicKey: 'lulc',
        hashParams: new URLSearchParams('land-cover-thematic-accuracy--corine_class=11'),
        expected: '11'
      },
      {
        description: 'Invalid corine class',
        topicKey: 'lulc',
        hashParams: new URLSearchParams('land-cover-thematic-accuracy--corine_class=19'),
        expected: ''
      },
      {
        description: 'No corine class selected',
        topicKey: 'building-lulc',
        hashParams: new URLSearchParams('land-cover-thematic-accuracy--corine_class='),
        expected: ''
      }
    ];

    hashParamsCases.forEach((hashParamsCase) => {
      it(hashParamsCase.description, () => {
        const result = component.getCorineClassFromUrlHashParams(hashParamsCase.hashParams);
        expect(result).toEqual(hashParamsCase.expected);
      })
    })
  });
});
