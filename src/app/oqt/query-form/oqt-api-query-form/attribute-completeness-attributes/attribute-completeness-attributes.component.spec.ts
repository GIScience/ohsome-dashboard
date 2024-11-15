import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {AttributeCompletenessAttributesComponent} from './attribute-completeness-attributes.component';
import {OqtModule} from '../../../oqt.module';
import {OqtApiMetadataProviderService} from '../../../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../../oqt-api-metadata-provider.service.mock';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {SimpleChange} from '@angular/core';
import {oqtAttributesResponseMock} from '../../../oqt-api-metadata.response.mock';

describe('AttributeCompletenessIndicatorComponent', () => {
  let component: AttributeCompletenessAttributesComponent;
  let fixture: ComponentFixture<AttributeCompletenessAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OqtModule],
      providers: [
        NgForm,
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock},
        provideHttpClient(withInterceptorsFromDi())
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AttributeCompletenessAttributesComponent);
    component = fixture.componentInstance;
    component.selectedTopicKey = "roads";
    component.topicName = "Roads";
    component.indicatorKey = "attribute-completeness";
    component.hashParams = new URLSearchParams("attribute-completeness--attributes=name");
    component.selectedAttributeKeys = ['name'];
    component.indicatorChecked = true;
    component.attributes = component.oqtApiMetadataProviderService.getAttributes().result;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sanitize the attribute list when the topic changes', () => {
    spyOn(component, 'sanitizeAttributeKeys').and.callThrough();
    spyOn(component, 'initAttributeDropdown');

    // switch from topic roads to building-count
    component.selectedTopicKey = "building-count";
    component.ngOnChanges({
      selectedTopicKey: new SimpleChange('roads', component.selectedTopicKey, false)
    });
    fixture.detectChanges();

    expect(component.sanitizeAttributeKeys).toHaveBeenCalled();
    expect(component.selectedAttributeKeys).toEqual([component.getDefaultAttributeKey(component.selectedTopicKey)]);
    expect(component.initAttributeDropdown).toHaveBeenCalled();
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
        component.selectedTopicKey = hashParamsCase.topicKey;
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

    beforeEach(async () => {
      //clean the DOM
      const dimmmer = document.querySelector('body > div.ui.dimmer.modals');
      if (dimmmer) {
        document.body.removeChild(dimmmer);
      }
    })

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
        //expect DOM element not to be there
        expected: {
          element: {
            shouldExist: false
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
      it(testCase.description, fakeAsync(() => {

        component.showAttributeDetails(testCase.event);

        // wait for the css transition to be finished before checking the final DOM elements state
        tick(1000)

        // check for the dimmer to exist (will be created by semantic-ui modal('show')
        const element = document.querySelector('body > div.ui.dimmer.modals')

        if (testCase.expected.element.shouldExist) {
          expect(element).toBeDefined();
          if (testCase.expected.element.shouldHaveClass) {
            expect(element).toHaveClass('visible');
          }
        } else {
          expect(element).toBeNull();
        }
      }))
    })
  })

});
