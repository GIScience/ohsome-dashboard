import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RoadsThematicAccuracyIndicatorComponent} from './roads-thematic-accuracy-indicator.component';
import {OqtModule} from '../../../oqt.module';
import {OqtApiMetadataProviderService} from '../../../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../../oqt-api-metadata-provider.service.mock';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { provideAppInitializer } from '@angular/core';
import {preparePrismToRenderOhsomeFilterLangauge} from '../../../../../main';
import {PrismEditorComponent} from '../../../../shared/components/prism-editor/prism-editor.component';


describe('RoadsThematicAccuracyIndicatorComponent', () => {
  let component: RoadsThematicAccuracyIndicatorComponent;
  let fixture: ComponentFixture<RoadsThematicAccuracyIndicatorComponent>;

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

    fixture = TestBed.createComponent(RoadsThematicAccuracyIndicatorComponent);
    component = fixture.componentInstance;
    component.indicatorKey = "roads-thematic-accuracy";
    component.hashParams = new URLSearchParams("roads-thematic-accuracy--attribute=surface");
    component.selectedThematicAttributeIds = 'surface';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('getThematicAttributeFromUrlHashParams', () => {
    const hashParamsCases = [
      {
        description: 'Valid attribute',
        topicKey: 'roads',
        hashParams: new URLSearchParams('roads-thematic-accuracy--attribute=surface'),
        expected: 'surface'
      },
      {
        description: 'Invalid attribute',
        topicKey: 'roads',
        hashParams: new URLSearchParams('roads-thematic-accuracy--attribute=foo'),
        expected: ''
      },
      {
        description: 'No attribute selected',
        topicKey: 'roads',
        hashParams: new URLSearchParams('roads-thematic-accuracy--attribute='),
        expected: ''
      }
    ];

    hashParamsCases.forEach((hashParamsCase) => {
      it(hashParamsCase.description, () => {
        const result = component.getThematicAttributeFromUrlHashParams(hashParamsCase.hashParams);
        expect(result).toEqual(hashParamsCase.expected);
      })
    })
  });
});
