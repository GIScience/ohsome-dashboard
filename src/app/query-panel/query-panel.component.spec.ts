import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {QueryPanelComponent} from './query-panel.component';
import {OhsomeApiMetadataProviderService} from '../ohsomeapi/ohsome-api-metadata-provider.service';
import OhsomeApiMetadataProviderServiceMock from '../ohsomeapi/ohsome-api-metadata-provider.service.mock';
import {OshdbModule} from '../ohsomeapi/oshdb.module';
import {BrowserModule} from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import {OqtModule} from '../oqapi/oqt.module';
import {beforeEach, describe, expect, it } from 'vitest';

describe('QueryPanelComponent', () => {
  let component: QueryPanelComponent;
  let fixture: ComponentFixture<QueryPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BrowserModule,
        OshdbModule,
        OqtModule, QueryPanelComponent],
    providers: [
        { provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock },
        provideHttpClient(withXhr(), withInterceptorsFromDi())
    ]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryPanelComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
