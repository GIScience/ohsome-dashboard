import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ThematicAccuracyIndicatorComponent} from './thematic-accuracy-indicator.component';
import {OqtModule} from '../../../oqt.module';
import {OqtApiMetadataProviderService} from '../../../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../../oqt-api-metadata-provider.service.mock';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { provideAppInitializer } from '@angular/core';
import {preparePrismToRenderOhsomeFilterLangauge} from '../../../../../main';
import {PrismEditorComponent} from '../../../../shared/components/prism-editor/prism-editor.component';


describe('ThematicAccuracyIndicatorComponent', () => {
  let component: ThematicAccuracyIndicatorComponent;
  let fixture: ComponentFixture<ThematicAccuracyIndicatorComponent>;

  describe('with land-cover-thematic-accuracy indicator', () => {

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

      fixture = TestBed.createComponent(ThematicAccuracyIndicatorComponent);
      component = fixture.componentInstance;
      component.indicatorKey = "land-cover-thematic-accuracy";
      component.hashParams = new URLSearchParams("land-cover-thematic-accuracy--corine_land_cover_class=11");
      component.selectedCategoryIds = '11';
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });


    describe('getThematicAccuracyFromUrlHashParams', () => {
      const hashParamsCases = [
        {
          description: 'Valid corine land cover class',
          topicKey: 'land-cover',
          hashParams: new URLSearchParams('land-cover-thematic-accuracy--corine_land_cover_class=11'),
          expected: '11'
        },
        {
          description: 'Invalid corine land cover class',
          topicKey: 'land-cover',
          hashParams: new URLSearchParams('land-cover-thematic-accuracy--corine_land_cover_class=19'),
          expected: ''
        },
        {
          description: 'No corine land cover class selected',
          topicKey: 'land-cover',
          hashParams: new URLSearchParams('land-cover-thematic-accuracy--corine_land_cover_class='),
          expected: ''
        }
      ];

      hashParamsCases.forEach((hashParamsCase) => {
        it(hashParamsCase.description, () => {
          const result = component.getThematicCategoryFromUrlHashParams(hashParamsCase.hashParams);
          expect(result).toEqual(hashParamsCase.expected);
        })
      })
    });
  });


  describe('with roads-thematic-accuracy indicator', () => {

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

      fixture = TestBed.createComponent(ThematicAccuracyIndicatorComponent);
      component = fixture.componentInstance;
      component.indicatorKey = "roads-thematic-accuracy";
      component.hashParams = new URLSearchParams("roads-thematic-accuracy--attribute=surface");
      component.selectedCategoryIds = 'surface';
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });


    describe('getCorineLandCoverClassFromUrlHashParams', () => {
      const hashParamsCases = [
        {
          description: 'Valid thematic attribute',
          topicKey: 'roads',
          hashParams: new URLSearchParams('roads-thematic-accuracy--attribute=surface'),
          expected: 'surface'
        },
        {
          description: 'Invalid thematic attribute',
          topicKey: 'roads',
          hashParams: new URLSearchParams('roads-thematic-accuracy--attribute=foo'),
          expected: ''
        },
        {
          description: 'No thematic attribute selected',
          topicKey: 'roads',
          hashParams: new URLSearchParams('roads-thematic-accuracy--attribute='),
          expected: ''
        }
      ];

      hashParamsCases.forEach((hashParamsCase) => {
        it(hashParamsCase.description, () => {
          const result = component.getThematicCategoryFromUrlHashParams(hashParamsCase.hashParams);
          expect(result).toEqual(hashParamsCase.expected);
        })
      })
    });
  });
});
