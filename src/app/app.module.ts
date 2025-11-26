import { NgModule, inject, provideAppInitializer } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {AppComponent} from './app.component';

import {OshdbModule} from './oshdb/oshdb.module';
import {OhsomeApiMetadataProviderService} from './oshdb/ohsome-api-metadata-provider.service';
import {OqtApiMetadataProviderService} from './oqt/oqt-api-metadata-provider.service';
import {OqtModule} from './oqt/oqt.module';
import {UrlHashParamsProviderService} from './singelton-services/url-hash-params-provider.service';
import {QueryPanelComponent} from './query-panel/query-panel.component';
import {SharedModule} from './shared/shared.module';
import {ResultListDirective} from './result-panel/result-list.directive';
import {ResultPanelComponent} from './result-panel/result-panel.component';
import {catchError, EMPTY} from 'rxjs';
import {PRISM_LANGUAGE_OHSOME_FILTER} from '../prism-language-ohsome-filter';
import {WelcomeComponent} from './welcome/welcome.component';
import { loadTranslations } from '@angular/localize';
import {StateService} from './singelton-services/state.service';

declare const Prism;

@NgModule({
  declarations: [
    AppComponent,
    QueryPanelComponent,
    ResultPanelComponent,
    ResultListDirective
  ],
  exports: [
    QueryPanelComponent,
    ResultPanelComponent,
    ResultListDirective
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    SharedModule,
    OshdbModule,
    OqtModule,
    WelcomeComponent
  ],
  providers: [
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
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ]
})
export class AppModule {
}

export function preparePrismToRenderOhsomeFilterLangauge() {
  // prepare syntax highlighting for ohsome-filter
  return () : void =>  {
    Prism.languages['ohsome-filter'] = PRISM_LANGUAGE_OHSOME_FILTER;
  }
}

export function ohsomeApiMetadataProviderFactory(provider: OhsomeApiMetadataProviderService) {
  return () => provider.loadOhsomeMetadata().pipe(
    catchError(() => EMPTY)
  );
}

export function ohsomeApiAnnouncementProviderFactory(provider: OhsomeApiMetadataProviderService) {
  return () => provider.loadOhsomeApiAnnouncement();
}

export function oqtApiMetadataProviderFactory(provider: OqtApiMetadataProviderService) {
  return () => provider.loadOqtApiMetadata().pipe(
    catchError(() => EMPTY)
  )
}

export function oqtApiAttributeProviderFactory(provider: OqtApiMetadataProviderService) {
  return () => provider.loadAttributes().pipe(
    catchError(() => EMPTY)
  )
}

export function urlHashParamsProviderFactory(provider: UrlHashParamsProviderService) {
  return () => provider.updateHashParamsStoreFromUrl()
}

export function translationsInitializerFactory(provider: StateService) {
  return async () => {

    const documentLanguage = document.querySelector('html')?.getAttribute('lang');
    const appLanguage = documentLanguage ?? "en";
    provider.updatePartialState({appLanguage});

    if (appLanguage === 'en') return;

    try {
      const translationsModule = await import(`../locale/messages.${appLanguage}.json`);
      const translations = translationsModule.default.translations || translationsModule.default;

      loadTranslations(translations);
      console.log(`Loaded translations for locale: ${appLanguage}`);
    } catch (err) {
      console.warn(`Could not load translation file for locale: ${appLanguage}`, err);
    }
  };
}
