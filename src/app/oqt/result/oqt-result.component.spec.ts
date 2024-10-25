import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OqtResultComponent} from './oqt-result.component';
import {HttpClientModule} from '@angular/common/http';
import {OqtApiMetadataProviderService} from '../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../oqt-api-metadata-provider.service.mock';
import {OqtModule} from '../oqt.module';
import {IndicatorParams} from '../types/types';


describe('OqtResultComponent', () => {
  let component: OqtResultComponent;
  let fixture: ComponentFixture<OqtResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OqtResultComponent],
      imports: [HttpClientModule, OqtModule],
      providers: [
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OqtResultComponent);
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a list of indicators with their respective parameters that should be requested', () => {
    const expected: IndicatorParams[] = [
      {key: 'mapping-saturation', value: {params: null}},
      {key: 'attribute-completeness', value: {params: {attribute: 'house-number'}}}
    ];
    const indicatorParamsList = component.createIndicatorListWithParams();

    expect(indicatorParamsList).toEqual(expected);
  })
});
