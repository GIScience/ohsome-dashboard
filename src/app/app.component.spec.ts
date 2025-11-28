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
import {provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {OqtApiMetadataProviderService} from './oqt/oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from './oqt/oqt-api-metadata-provider.service.mock';
import {UrlHashParamsProviderService} from './singelton-services/url-hash-params-provider.service';
import UrlHashParamsProviderServiceMock from './singelton-services/url-hash-params-provider.service.mock';
import {WelcomeComponent} from './welcome/welcome.component';
import {StateService} from './singelton-services/state.service';

describe('AppComponent', () => {

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        QueryPanelComponent,
        ResultPanelComponent,
      ],
      imports: [
        BrowserModule,
        SharedModule,
        OshdbModule,
        OqtModule,
        WelcomeComponent,
        ResultListDirective
      ],
      providers: [
        {provide: UrlHashParamsProviderService, useValue: UrlHashParamsProviderServiceMock},
        {provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock},
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock},
        {provide: StateService},
        provideHttpClient(withInterceptorsFromDi(), withFetch())
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
      UrlHashParamsProviderServiceMock.getHashURLSearchParams.and.returnValue(new URLSearchParams());
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect((app as any).stateService.appState().showWelcomeScreen).toBeTrue();
    }
  );

  it('should not show welcome screen', () => {
      UrlHashParamsProviderServiceMock.getHashURLSearchParams.and.returnValue(new URLSearchParams({backend: "ohsomeApi"}));
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect((app as any).stateService.appState().showWelcomeScreen).toBeFalse();
    }
  );
});
