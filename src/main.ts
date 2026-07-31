/// <reference types="@angular/localize" />
import {importProvidersFrom, inject, provideAppInitializer} from "@angular/core";
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {StateService} from "./app/singelton-services/state.service";
import {OhsomeApiMetadataProviderService} from "./app/ohsomeapi/ohsome-api-metadata-provider.service";
import {OqtApiMetadataProviderService} from "./app/02_quality/oqt-api-metadata-provider.service";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {OshdbModule} from "./app/ohsomeapi/oshdb.module";
import {OqtModule} from "./app/02_quality/oqt.module";
import {AppComponent} from "./app/app.component";
import {AuthService} from "./app/singelton-services/auth.service";
import {
  ohsomeApiAnnouncementProviderFactory,
  ohsomeApiMetadataProviderFactory,
  oqtApiAttributeProviderFactory,
  oqtApiMetadataProviderFactory,
  preparePrismToRenderOhsomeFilterLangauge,
  translationsInitializerFactory,
} from './app-initializers';
import {authInterceptor} from './app/interceptors/auth.interceptor';
import {timeoutInterceptor} from './app/interceptors/timeout.interceptor';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, OshdbModule, OqtModule),
    provideAppInitializer(() => {
      const initializerFn = (translationsInitializerFactory)(inject(StateService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = (ohsomeApiMetadataProviderFactory)(inject(OhsomeApiMetadataProviderService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = (ohsomeApiAnnouncementProviderFactory)(inject(OhsomeApiMetadataProviderService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = (oqtApiMetadataProviderFactory)(inject(OqtApiMetadataProviderService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = (oqtApiAttributeProviderFactory)(inject(OqtApiMetadataProviderService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = (preparePrismToRenderOhsomeFilterLangauge)();
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.initializeUser()
    }),
    provideHttpClient(withInterceptors([authInterceptor, timeoutInterceptor]))
  ]
})
  .catch(err => console.error(err));
