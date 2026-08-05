import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResultComponent} from './result.component';
import {OshdbModule} from '../../ohsomeapi/oshdb.module';
import {provideHttpClient} from '@angular/common/http';
import {OhsomeApiMetadataProviderService} from '../../ohsomeapi/ohsome-api-metadata-provider.service';
import OhsomeApiMetadataProviderServiceMock from '../../ohsomeapi/ohsome-api-metadata-provider.service.mock';
import {afterEach, beforeEach, describe, expect, it} from "vitest";

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  const formValuesMock = {
    topic: 'custom-topic',
    "topic-filter": 'natural=* and type:node',
    groupBy: 'none',
    bboxes: '8.9,48.8,9.0,48.9',
    start: '2025-01-01Z',
    end: '2026-01-01Z',
    interval: 'P1M'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OshdbModule,
        ResultComponent
      ],
      providers: [
        {provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock},
        provideHttpClient()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ResultComponent);

    component = fixture.componentInstance;
    fixture.componentRef.setInput('formValues', formValuesMock);
    component.boundaryType = 'bpoly';
    fixture.detectChanges();

    const testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    testContainer.appendChild(fixture.nativeElement);
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    document.getElementById('test-container')?.remove();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
