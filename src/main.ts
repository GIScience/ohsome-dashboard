/// <reference types="@angular/localize" />
import {importProvidersFrom, inject, provideAppInitializer} from "@angular/core";
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {StateService} from "./app/singelton-services/state.service";
import {loadTranslations} from "@angular/localize";
import {UrlHashParamsProviderService} from "./app/singelton-services/url-hash-params-provider.service";
import {OhsomeApiMetadataProviderService} from "./app/ohsomeapi/ohsome-api-metadata-provider.service";
import {catchError, EMPTY} from "rxjs";
import {OqtApiMetadataProviderService} from "./app/oqapi/oqt-api-metadata-provider.service";
import {PRISM_LANGUAGE_OHSOME_FILTER} from "./prism-language-ohsome-filter";
import {provideHttpClient, withFetch, withInterceptorsFromDi} from "@angular/common/http";
import {OshdbModule} from "./app/ohsomeapi/oshdb.module";
import {OqtModule} from "./app/oqapi/oqt.module";
import {AppComponent} from "./app/app.component";

declare const Prism;


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
    provideHttpClient(withInterceptorsFromDi(), withFetch())
  ]
})
  .catch(err => console.error(err));


export function preparePrismToRenderOhsomeFilterLangauge() {
  // prepare syntax highlighting for ohsome-filter
  return (): void => {
    Prism.languages['ohsome-filter'] = PRISM_LANGUAGE_OHSOME_FILTER;
  }
}

function ohsomeApiMetadataProviderFactory(provider: OhsomeApiMetadataProviderService) {
  return () => provider.loadOhsomeMetadata().pipe(
    catchError(() => EMPTY)
  );
}

function ohsomeApiAnnouncementProviderFactory(provider: OhsomeApiMetadataProviderService) {
  return () => provider.loadOhsomeApiAnnouncement();
}

function oqtApiMetadataProviderFactory(provider: OqtApiMetadataProviderService) {
  return () => provider.loadOqtApiMetadata().pipe(
    catchError(() => EMPTY)
  )
}

function oqtApiAttributeProviderFactory(provider: OqtApiMetadataProviderService) {
  return () => provider.loadAttributes().pipe(
    catchError(() => EMPTY)
  )
}

function urlHashParamsProviderFactory(provider: UrlHashParamsProviderService) {
  return () => provider.updateHashParamsStoreFromUrl()
}

function translationsInitializerFactory(provider: StateService) {
  return async () => {

    const documentLanguage = document.querySelector('html')?.getAttribute('lang');
    const appLanguage = documentLanguage ?? "en";
    provider.updatePartialState({appLanguage});

    if (appLanguage === 'en') return;

    try {
      const translationsModule = await import(`./locale/messages.${appLanguage}.json`);
      const translations = translationsModule.default.translations || translationsModule.default;

      loadTranslations(translations);
      console.log(`Loaded translations for locale: ${appLanguage}`);
    } catch (err) {
      console.warn(`Could not load translation file for locale: ${appLanguage}`, err);
    }
  };
}
