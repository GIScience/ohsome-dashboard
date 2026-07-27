import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExtractionQueryFormComponent} from './extraction-query-form.component';

import {beforeEach, describe, expect, it} from 'vitest';
import {OqtApiMetadataProviderService} from '../../oqapi/oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../oqapi/oqt-api-metadata-provider.service.mock';

describe('ExtractionQueryFormComponent', () => {
  let component: ExtractionQueryFormComponent;
  let fixture: ComponentFixture<ExtractionQueryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtractionQueryFormComponent],
      providers: [
        { provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExtractionQueryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
