import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {OshdbModule} from './oshdb/oshdb.module';
import {OhsomeApiMetadataProviderService} from './oshdb/ohsome-api-metadata-provider.service';
import OhsomeApiMetadataProviderServiceMock from './oshdb/ohsome-api-metadata-provider.service.mock';
import {QueryPanelComponent} from './query-panel/query-panel.component';
import {ResultPanelComponent} from './result-panel/result-panel.component';
import {ResultListDirective} from './result-panel/result-list.directive';
import {SharedModule} from './shared/shared.module';
import {OqtModule} from './oqt/oqt.module';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {OqtApiMetadataProviderService} from './oqt/oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from './oqt/oqt-api-metadata-provider.service.mock';

describe('AppComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        QueryPanelComponent,
        ResultPanelComponent,
        ResultListDirective,
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        SharedModule,
        OshdbModule,
        OqtModule
      ],
      providers: [
        {provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock},
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock}
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ohsome dashboard'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ohsome dashboard');
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.content span')?.textContent).toContain('ng15-dashboard app is running!');
  // });
});
