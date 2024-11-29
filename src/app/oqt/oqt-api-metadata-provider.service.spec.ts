import {TestBed} from '@angular/core/testing';

import {OqtApiMetadataProviderService} from './oqt-api-metadata-provider.service';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {OqtAttribute} from './types/types';

describe('OqtMetadataProviderService', () => {
  let service: OqtApiMetadataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(OqtApiMetadataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAttributeFilter()', () => {
    const testAttributes: Record<string, Record<string, OqtAttribute>> = {
      topic1: {
        attributeKey1: {
          name: 'Attribute 1',
          description: 'This is attribute one.',
          filter: 'attr=one'
        },
        attributeKey2: {
          name: 'Attribute 2',
          description: 'This is attribute two.',
          filter: 'attr=two'
        },
      }
    }

    const testCases = [
      {
        description: "should return the filter, when topic HAS attributes and attribute IS available",
        topicKey: 'topic1',
        attributeKey: 'attributeKey1',
        expected: 'attr=one'
      },
      {
        description: "should return undefined, when topic HAS attributes but attribute IS NOT available",
        topicKey: 'topic1',
        attributeKey: 'nonAvailableAttrKey',
        expected: undefined
      },
      {
        description: "should return undefined, when topic HAS NO attributes",
        topicKey: 'topicWhichHasNoAttributes',
        attributeKey: '',
        expected: undefined
      },
    ];

    testCases.forEach((testCase) => {
      it(testCase.description, () => {
        service.oqtAttributes = {result: testAttributes};

        const result = service.getAttributeFilter(testCase.topicKey, testCase.attributeKey);

        expect(result).toEqual(testCase.expected);

      })
    })
  })
});
