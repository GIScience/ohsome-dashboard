import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {OhsomeApiMetadataProviderService} from './ohsomeapi/ohsome-api-metadata-provider.service';
import OhsomeApiMetadataProviderServiceMock from './ohsomeapi/ohsome-api-metadata-provider.service.mock';
import {QueryPanelComponent} from './query-panel/query-panel.component';
import {ResultPanelComponent} from './result-panel/result-panel.component';
import {ResultListDirective} from './result-panel/result-list.directive';
import {OqtModule} from './02_quality/oqt.module';
import {BrowserModule} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {OqtApiMetadataProviderService} from './02_quality/oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from './02_quality/oqt-api-metadata-provider.service.mock';
import {WelcomeComponent} from './welcome/welcome.component';
import {StateService} from './singelton-services/state.service';
import {beforeEach, describe, expect, it} from "vitest";

describe('AppComponent', () => {

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        OqtModule,
        WelcomeComponent,
        ResultListDirective,
        QueryPanelComponent,
        ResultPanelComponent,
        AppComponent
      ],
      providers: [
        {provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock},
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock},
        {provide: StateService},
        provideHttpClient()
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

  it('should show welcome screen', () => {
    globalThis.location.hash = '';
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect((app as any).stateService.appState().showWelcomeScreen).toBe(true);
  });

  it('should not show welcome screen', () => {
    globalThis.location.hash = 'backend=extraction';
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect((app as any).stateService.appState().showWelcomeScreen).toBe(false);
  });
});
