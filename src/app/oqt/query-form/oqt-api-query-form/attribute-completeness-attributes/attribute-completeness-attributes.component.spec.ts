import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AttributeCompletenessAttributesComponent} from './attribute-completeness-attributes.component';
import {OqtModule} from '../../../oqt.module';
import {OqtApiMetadataProviderService} from '../../../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../../oqt-api-metadata-provider.service.mock';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {APP_INITIALIZER, SimpleChange} from '@angular/core';
import {oqtAttributesResponseMock} from '../../../oqt-api-metadata.response.mock';
import {preparePrismToRenderOhsomeFilterLangauge} from '../../../../app.module';
import {OqtAttribute, RawTopicMetadata, Topic} from '../../../types/types';
import {PrismEditorComponent} from '../../../../shared/components/prism-editor/prism-editor.component';
import {By} from '@angular/platform-browser';
import oqtApiMetadataProviderServiceMock from '../../../oqt-api-metadata-provider.service.mock';

describe('AttributeCompletenessIndicatorComponent', () => {
  let component: AttributeCompletenessAttributesComponent;
  let fixture: ComponentFixture<AttributeCompletenessAttributesComponent>;
  const roadsTopic: RawTopicMetadata = oqtApiMetadataProviderServiceMock.getOqtApiMetadata().result.topics["roads"];
  const enrichedRoadsTopic: Topic = {...roadsTopic, key: 'roads'};
  const buildingCountTopic: RawTopicMetadata = oqtApiMetadataProviderServiceMock.getOqtApiMetadata().result.topics["building-count"];
  const enrichedBuildingCountTopic: Topic = {...buildingCountTopic, key: 'building-count'};
  const enrichedTopicsMock = {
    roads: enrichedRoadsTopic,
    'building-count': enrichedBuildingCountTopic,
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OqtModule, PrismEditorComponent],
      providers: [
        NgForm,
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock},
        {
          provide: APP_INITIALIZER,
          useFactory: preparePrismToRenderOhsomeFilterLangauge,
          multi: true
        },
        provideHttpClient(withInterceptorsFromDi())
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AttributeCompletenessAttributesComponent);
    component = fixture.componentInstance;
    component.selectedTopic = enrichedRoadsTopic;
    component.indicatorKey = "attribute-completeness";
    component.hashParams = new URLSearchParams("attribute-completeness--attributes=name");
    component.selectedAttributeKeys = ['name'];
    component.attributes = component.oqtApiMetadataProviderService.getAttributes().result;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sanitize the attribute list when the topic changes', () => {
    spyOn(component, 'sanitizeAttributeKeys').and.callThrough();


    // switch from topic roads to building-count
    component.selectedTopic = enrichedBuildingCountTopic;
    component.ngOnChanges({
      selectedTopic: new SimpleChange(enrichedRoadsTopic, component.selectedTopic, false)
    });
    fixture.detectChanges();

    expect(component.sanitizeAttributeKeys).toHaveBeenCalled();
    expect(component.selectedAttributeKeys).toEqual([component.getDefaultAttributeKey(component.selectedTopic.key)]);
  });

  describe('getAttributeKeysFromUrlHashParams(hashParams)', () => {
    const hashParamsCases = [
      {
        description: 'Single attribute fitting to topic',
        topicKey: 'roads',
        hashParams: new URLSearchParams('attribute-completeness--attributes=name'),
        expected: ['name']
      },
      {
        description: 'Multi attribute fitting to topic',
        topicKey: 'roads',
        hashParams: new URLSearchParams('attribute-completeness--attributes=name,maxspeed'),
        expected: ['name', 'maxspeed']
      },
      {
        description: 'Single attribute NOT fitting to topic',
        topicKey: 'building-count',
        hashParams: new URLSearchParams('attribute-completeness--attributes=name'),
        expected: ['height']
      },
      {
        description: 'Multi attribute NOT fitting to topic',
        topicKey: 'building-count',
        hashParams: new URLSearchParams('attribute-completeness--attributes=name,maxspeed'),
        expected: ['height']
      },
      {
        description: 'Empty attribute',
        topicKey: 'building-count',
        hashParams: new URLSearchParams('attribute-completeness--attributes='),
        expected: ['height']
      },
      {
        description: 'Not existing attribute (null)',
        topicKey: 'building-count',
        hashParams: new URLSearchParams(''),
        expected: ['height']
      }
    ];

    hashParamsCases.forEach((hashParamsCase) => {
      it(hashParamsCase.description, () => {
        component.selectedTopic = enrichedTopicsMock[hashParamsCase.topicKey];
        const result = component.getAttributeKeysFromUrlHashParams(hashParamsCase.hashParams);
        expect(result).toEqual(hashParamsCase.expected);
      })
    })
  });

  describe('getDefaultAttributeKey(topicKey)', () => {
    const testCases = [
      {
        description: 'Get default attribute key for topic that has attributes',
        topicKey: 'building-count',
        expected: 'height',
      },
      {
        description: 'Get empty string as attribute key for topic that has NO attributes',
        topicKey: 'topic-that-does-not-have-attributes',
        expected: ''
      }
    ];
    testCases.forEach((testCase) => {
      it(testCase.description, () => {
        const result = component.getDefaultAttributeKey(testCase.topicKey);
        expect(result).toEqual(testCase.expected);
      })
    })
  });

  describe('getAttributesByTopicKey(topicKey)', () => {
    const testCases = [
      {
        description: 'Get all attributes for a topic that has attributes',
        topicKey: 'building-count',
        expected: oqtAttributesResponseMock.result['building-count'],
      },
      {
        description: 'Get empty object for a topic that has NO attributes',
        topicKey: 'topic-that-does-not-have-attributes',
        expected: {},
      }
    ];

    testCases.forEach((testCase) => {
      it(testCase.description, () => {
        const result = component.getAttributesByTopicKey(testCase.topicKey);
        expect(result).toEqual(testCase.expected);
      })
    })
  })

  describe('showAttributeDetails(event)', () => {

    // function cleanTheDOM() {
    //   const dimmmer = document.querySelector('body > div.ui.dimmer.modals');
    //   if (dimmmer) {
    //     document.body.removeChild(dimmmer);
    //   }
    // }
    //
    // beforeEach(async () => {
    //   cleanTheDOM()
    // })
    //
    // afterEach(async () => {
    //   cleanTheDOM()
    // })

    // the event is coming from the anchor element which hosts the 'x'-icon, so clicking x also triggers the event but
    // rather than opening the details we only want to remove the attribute from the selected list
    // on the other hand if you directly click on the label we want to open the attribute details modal window

    const testCases = [
      {
        description: "User clicked on the 'x' to remove selected item",
        event: {
          target: 'close icon',
          currentTarget: 'anchor element representing the selected attribute label',
          data: {attributeKey: 'name'}
        },
        //DOM element should be there and NOT having the class visible
        expected: {
          element: {
            shouldExist: true,
            shouldNotHaveClass: 'visible'
          }
        }
      },
      {
        description: "User clicked directly on the label to open the attribute details",
        event: {
          target: 'anchor element representing the selected attribute label',
          currentTarget: 'anchor element representing the selected attribute label',
          data: {attributeKey: 'name'}
        },
        //DOM element should be there and having the class visible
        expected: {
          element: {
            shouldExist: true,
            shouldHaveClass: 'visible'
          }
        }
      },
    ];

    testCases.forEach((testCase) => {
      it(testCase.description, async () => {

        component.showAttributeDetails(testCase.event);

        // wait for the css transition to be finished before checking the final DOM elements state
        await new Promise((resolve) => setTimeout(resolve, 500));

        // check for the dimmer to exist (will be created by semantic-ui modal('show')
        // const element = document.querySelector('body > div.ui.dimmer.modals')
        const modalContentElement = fixture.nativeElement.querySelector('div#attribute-details');

        if (testCase.expected.element.shouldExist) {
          expect(modalContentElement).toBeDefined();
          if (testCase.expected.element.shouldHaveClass) {
            expect(modalContentElement).toHaveClass('visible');
          }
          if (testCase.expected.element.shouldNotHaveClass) {
            expect(modalContentElement).not.toHaveClass('visible');
          }
        }
      })
    })
  })

  describe('combineSelectedAttributes()', () => {

    const topics = {
      topic1: {
        key: 'topic1',
      }
    }

    const testCases = [
      {
        description: 'no filters selected',
        selectedTopicKey: 'topic1',
        selectedAttributeKeys: [],
        filterValues: [undefined],
        expectedFilter: '',
        nameValues: [undefined],
        expectedName: '',
      },
      {
        description: 'one valid filter',
        selectedTopicKey: 'topic1',
        selectedAttributeKeys: ['attributeKey1'],
        filterValues: ['attr=one'],
        expectedFilter: 'attr=one',
        nameValues: ['Attribute One'],
        expectedName: 'Attribute One',
      },
      {
        description: 'multiple valid filters',
        selectedTopicKey: 'topic1',
        selectedAttributeKeys: ['attributeKey1', 'attributeKey2'],
        filterValues: ['attr=one', 'attr=two'],
        expectedFilter: `(
  attr=one
) and (
  attr=two
)`,
        nameValues: ['Attribute One', 'Attribute Two'],
        expectedName: 'Attribute One and Attribute Two',
      },
      {
        description: 'one invalid filter',
        selectedTopicKey: 'topic1',
        selectedAttributeKeys: ['invalidKey'],
        filterValues: [undefined],
        expectedFilter: '',
        nameValues: [undefined],
        expectedName: '',
      },
      {
        description: 'mix of valid and invalid filters',
        selectedTopicKey: 'topic1',
        selectedAttributeKeys: ['attributeKey1', 'invalidKey', 'attributeKey2'],
        filterValues: ['attr=one', undefined, 'attr=two'],
        expectedFilter: `(
  attr=one
) and (
  attr=two
)`,
        nameValues: ['Attribute One', undefined, 'Attribute Two'],
        expectedName: 'Attribute One and Attribute Two',
      },
    ];

    testCases.forEach((testCase) => {
      it(testCase.description, async () => {

        (component.oqtApiMetadataProviderService as typeof oqtApiMetadataProviderServiceMock).getAttributeFilter.and.returnValues(...testCase.filterValues);
        (component.oqtApiMetadataProviderService as typeof oqtApiMetadataProviderServiceMock).getAttributeName.and.returnValues(...testCase.nameValues);

        component.selectedTopic = topics[testCase.selectedTopicKey];
        component.selectedAttributeKeys = testCase.selectedAttributeKeys;
        fixture.detectChanges()
        // await fixture.whenRenderingDone()
        await new Promise((resolve) => setTimeout(resolve, 1000));

        component.ngZone.runOutsideAngular(() => {
          const result = component.combineSelectedAttributes();

          expect(result.combinedNames).toEqual(testCase.expectedName);
          expect(result.combinedFilters).toEqual(testCase.expectedFilter);
        })
      })
    })

  });

  describe('showAttributeFilterEditDialog()', () => {
    const testAttributes: Record<string, Record<string, OqtAttribute>> = {
      topic1: {
        attributeKey1: {
          name: 'Attribute 1',
          description: 'This is attribute one.',
          filter: 'attr=one'
        },
      }
    };

    it('should exist and be visible with filter value', async () => {

      const combineSelectedAttributesReturnValue = {
        combinedNames: testAttributes['topic1']['attributeKey1'].name,
        combinedFilters: testAttributes['topic1']['attributeKey1'].filter
      }
      spyOn(component, 'combineSelectedAttributes').and.returnValue(combineSelectedAttributesReturnValue);

      // Arrange
      component.attributes = testAttributes;
      component.selectedTopic = {
        key: 'topic1',
        name: 'Topic One',
        filter: 'topic=one',
        aggregationType: 'count',
        description: 'This is test topic 1',
        endpoint: '',
        indicators: ['minimal'],
        projects: ['core'],
        source: null,
      };
      component.selectedAttributeKeys = ['attributeKey1'];
      fixture.detectChanges();

      component.showAttributeFilterEditDialog();
      fixture.detectChanges();

      // Wait for CSS transition to complete (simulate delay using a real Promise)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if the modal element exists and editor has the filter value
      const contentElement = fixture.nativeElement.querySelector('div#attributes-editor');
      const prismEditorDebugElement = fixture.debugElement.query(By.css('app-prism-editor#customAttributeFilter'));
      const prismEditorComponentInstance = prismEditorDebugElement.componentInstance as PrismEditorComponent;

      expect(contentElement).toBeDefined();
      expect(contentElement).toHaveClass('active');
      expect(prismEditorComponentInstance.value).toBe('attr=one');
    });
  });

});
