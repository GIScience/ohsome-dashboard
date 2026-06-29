/// <reference types="@angular/localize" />
import {importProvidersFrom, inject, provideAppInitializer} from "@angular/core";
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {StateService} from "./app/singelton-services/state.service";
import {UrlHashParamsProviderService} from "./app/singelton-services/url-hash-params-provider.service";
import {OhsomeApiMetadataProviderService} from "./app/ohsomeapi/ohsome-api-metadata-provider.service";
import {OqtApiMetadataProviderService} from "./app/oqapi/oqt-api-metadata-provider.service";
import {provideHttpClient, withFetch, withInterceptorsFromDi} from "@angular/common/http";
import {OshdbModule} from "./app/ohsomeapi/oshdb.module";
import {OqtModule} from "./app/oqapi/oqt.module";
import {AppComponent} from "./app/app.component";
import {AuthService} from "./app/singelton-services/auth.service";
import {
  ohsomeApiAnnouncementProviderFactory,
  ohsomeApiMetadataProviderFactory,
  oqtApiAttributeProviderFactory,
  oqtApiMetadataProviderFactory,
  preparePrismToRenderOhsomeFilterLangauge,
  translationsInitializerFactory,
  urlHashParamsProviderFactory
} from './app-initializers';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, OshdbModule, OqtModule),
    provideAppInitializer(() => {
      const initializerFn = (translationsInitializerFactory)(inject(StateService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = (urlHashParamsProviderFactory)(inject(UrlHashParamsProviderService));
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
    provideHttpClient(withInterceptorsFromDi(), withFetch())
  ]
})
  .catch(err => console.error(err));
