import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OqtResultComponent} from './oqt-result.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {OqtApiMetadataProviderService} from '../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../oqt-api-metadata-provider.service.mock';
import {OqtModule} from '../oqt.module';
import {IndicatorParams} from '../types/types';
import {Feature, FeatureCollection, GeoJsonProperties, Polygon} from 'geojson';


describe('OqtResultComponent', () => {
  let component: OqtResultComponent;
  let fixture: ComponentFixture<OqtResultComponent>;

  beforeEach(async () => {
    const testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    document.body.appendChild(testContainer);

    await TestBed.configureTestingModule({
    imports: [OqtModule, OqtResultComponent],
    providers: [
        { provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(OqtResultComponent);
    document.getElementById('test-container')!.appendChild(fixture.nativeElement);
    component = fixture.componentInstance;
    component.formValues = {
      'topic': "building-count",
      'mapping-saturation': true,
      'currentness': false,
      'attribute-completeness': true,
      'attribute-completeness--attribute': "house-number",
      'bboxes': "8.6252588,49.3819766,8.7295724,49.4364995"
    }
    fixture.detectChanges();
  });

  afterEach(() => {
    document.getElementById('test-container')?.remove();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the component with bpolys coordinate string', () => {
    delete component.formValues['bboxes'];
    component.formValues['bpolys'] = '8.33,49.30,8.33,49.28,8.35,49.28,8.36,49.29,8.35,49.30,8.33,49.30';
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should create the component with bpolys coordinate string with id prefix', () => {
    delete component.formValues['bboxes'];
    component.formValues['bpolys'] = 'Harthausen:8.33,49.30,8.33,49.28,8.35,49.28,8.36,49.29,8.35,49.30,8.33,49.30';
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should create the component with bpolys geojson string with multiple features', () => {
    delete component.formValues['bboxes'];
    const geojson = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "coordinates": [
              [
                [8.34, 49.30],
                [8.33, 49.29],
                [8.34, 49.28],
                [8.35, 49.29],
                [8.35, 49.30],
                [8.34, 49.30]
              ]
            ],
            "type": "Polygon"
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "coordinates": [
              [
                [8.347665, 49.2981],
                [8.347665, 49.2913],
                [8.359053, 49.2913],
                [8.359053, 49.2981],
                [8.347665, 49.2981]
              ]
            ],
            "type": "Polygon"
          }
        }
      ]
    };
    component.formValues['bpolys'] = JSON.stringify(geojson);
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should create a list of indicators with their respective parameters that should be requested', () => {
    const expected: IndicatorParams[] = [
      {key: 'mapping-saturation', value: {params: null}},
      {key: 'attribute-completeness', value: {params: {attribute: 'house-number'}}}
    ];
    const indicatorParamsList = component.createIndicatorListWithParams();

    expect(indicatorParamsList).toEqual(expected);
  });


  it('unionPolygonFeatures(features) should return a unified polygon', () => {
    const geojson: FeatureCollection<Polygon> = {
      "type": "FeatureCollection", "features": [{
        "type": "Feature", "id": "one", "properties": {}, "geometry": {
          "coordinates": [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]], "type": "Polygon"
        }
      }, {
        "type": "Feature", "id": "two","properties": {}, "geometry": {
          "coordinates": [[[1, 0], [2, 0], [2, 1], [1, 1], [1, 0]]], "type": "Polygon"
        }
      }]
    };

    const expected: Feature<Polygon, GeoJsonProperties> = {
      "type": "Feature", "id": "one + two", "properties": {"id": "one + two"}, "geometry": {
        "coordinates": [[[0, 0], [2, 0], [2, 1], [0, 1], [0, 0]]], "type": "Polygon"
      }
    };

    const result = component.unionPolygonFeatures(geojson.features);

    expect(result).toEqual(expected);

  })
});
