import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatsQueryFormComponent} from './stats-query-form.component';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../02_quality/oqt-api-metadata-provider.service.mock';
import {beforeEach, describe, expect, it} from 'vitest'

describe('StatsQueryFormComponent', () => {
  let component: StatsQueryFormComponent;
  let fixture: ComponentFixture<StatsQueryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsQueryFormComponent],
      providers: [
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StatsQueryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
