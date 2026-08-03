import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExtractionResultComponent} from './extraction-result.component';

import {beforeEach, describe, expect, it} from 'vitest';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../02_quality/oqt-api-metadata-provider.service.mock';

describe('ExtractionResultComponent', () => {
  let component: ExtractionResultComponent;
  let fixture: ComponentFixture<ExtractionResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtractionResultComponent],
      providers: [
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock},
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExtractionResultComponent);
    fixture.componentRef.setInput('formValues', {
      topic: 'cycleway'
    })
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
