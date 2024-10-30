import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {QueryPanelComponent} from './query-panel.component';
import {OhsomeApiMetadataProviderService} from '../oshdb/ohsome-api-metadata-provider.service';
import OhsomeApiMetadataProviderServiceMock from '../oshdb/ohsome-api-metadata-provider.service.mock';
import {OshdbModule} from '../oshdb/oshdb.module';
import {SharedModule} from '../shared/shared.module';
import {BrowserModule} from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {OqtModule} from '../oqt/oqt.module';

describe('QueryPanelComponent', () => {
  let component: QueryPanelComponent;
  let fixture: ComponentFixture<QueryPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [QueryPanelComponent],
    imports: [BrowserModule,
        SharedModule,
        OshdbModule,
        OqtModule],
    providers: [
        { provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock },
        provideHttpClient(withInterceptorsFromDi())
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
