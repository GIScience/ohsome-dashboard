import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndicatorResultComponent} from './indicator-result.component';
import {HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {ErrorResponseJSON} from '../../types/ErrorResponseJSON';
import {indicatorResponseMock} from '../indicator.response.mock';
import {oqtApiMetadataResponseMock} from '../../oqt-api-metadata.response.mock';

describe('IndicatorResultComponent', () => {
  let component: IndicatorResultComponent;
  let fixture: ComponentFixture<IndicatorResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndicatorResultComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IndicatorResultComponent);
    component = fixture.componentInstance;
    component.topicKey = 'building-area';
    component.indicator = {key: 'mapping-saturation', value: {params: null}}
    component.bpolys = {
      'features': [{
        'bbox': [
          8.6252588,
          49.3819766,
          8.7295724,
          49.4364995
        ],
        'geometry': {
          'coordinates': [
            [
              [
                8.6252588,
                49.3819766
              ],
              [
                8.7295724,
                49.3819766
              ],
              [
                8.7295724,
                49.4364995
              ],
              [
                8.6252588,
                49.4364995
              ],
              [
                8.6252588,
                49.3819766
              ]
            ]
          ],
          'type': 'Polygon'
        },
        'id': 'box 1',
        'properties': {
          'id': 'box 1'
        },
        'type': 'Feature'
      }
      ],
      'type': 'FeatureCollection'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should perform getIndicatorResults successfully', () => {

    spyOn(component['oqtApi'], 'getIndicator').and.returnValue(of(indicatorResponseMock));
    // allow usage of any to access private method
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'handleResponse');

    // allow usage of any to access private method
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    (component as any).getIndicatorResults();

    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeUndefined();
    // allow usage of any to access private method
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    expect((component as any).handleResponse).toHaveBeenCalled();
  })

  it('should perform getIndicatorResults with error handling', () => {
      const oqapiError: ErrorResponseJSON = {apiVersion: '1.9.0', type: 'SizeRestrictionError', detail: [{msg: 'Some error'}]}
      const mockError = new HttpErrorResponse({status: 422, statusText: 'UnprocessableEntity', error: oqapiError});

      spyOn(component['oqtApi'], 'getIndicator').and.returnValue(throwError(()=> mockError));

    // allow usage of any to access private method
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      (component as any).getIndicatorResults();

      expect(component.isLoading).toBeFalse();
      expect(component.error).toEqual(mockError.error);
  })

  it('should handle indicator results', () => {

    spyOn(component['oqtApiMetadataProviderService'],'getOqtApiMetadata' ).and.returnValue(oqtApiMetadataResponseMock);
    spyOn(component, 'createDisplayQualityLabel').and.returnValue('Test Label');

    // allow usage of any to access private method
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    (component as any).handleResponse(indicatorResponseMock);

    expect(component.plotlyDataLayoutConfig).toBeDefined();
    expect(component.label).toBe(indicatorResponseMock.result[0].result.label);
    expect(component.indicatorName).toBe(indicatorResponseMock.result[0].metadata.name);
    expect(component.indicatorResultDescription).toBe(indicatorResponseMock.result[0].result.description);
    expect(component.displayQualityLabel).toBe('Test Label');
  });

  it('should return the correct display quality label', () => {

    // Mock the metadata provider service to return the mock metadata
    spyOn(component['oqtApiMetadataProviderService'], 'getOqtApiMetadata').and.returnValue(oqtApiMetadataResponseMock);

    // Set component properties needed for the method
    component.label = 'green';

    // Call the method
    const displayQualityLabel = component.createDisplayQualityLabel();

    // Assert the output
    const metadataMockResult = oqtApiMetadataResponseMock.result;
    const qualityDimensionKey = metadataMockResult.indicators[component.indicator.key]['qualityDimension'];
    const labelQualifier = component.labelMap[component.label];
    const labelName = metadataMockResult.qualityDimensions[qualityDimensionKey].name.toLowerCase();
    expect(displayQualityLabel).toBe(`${labelQualifier} ${labelName}`);
  });


});
