import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {QueryPanelComponent} from './query-panel.component';
import {OhsomeApiMetadataProviderService} from '../oshdb/ohsome-api-metadata-provider.service';
import OhsomeApiMetadataProviderServiceMock from '../oshdb/ohsome-api-metadata-provider.service.mock';
import {OshdbModule} from '../oshdb/oshdb.module';
import {SharedModule} from '../shared/shared.module';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {OqtModule} from '../oqt/oqt.module';

describe('QueryPanelComponent', () => {
  let component: QueryPanelComponent;
  let fixture: ComponentFixture<QueryPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientModule,
        SharedModule,
        OshdbModule,
        OqtModule],
      declarations: [QueryPanelComponent],
      providers: [
        {provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryPanelComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
