import {OqtApiMetadataProviderService} from './app/oqapi/oqt-api-metadata-provider.service';
import {catchError, EMPTY} from 'rxjs';
import {OhsomeApiMetadataProviderService} from './app/ohsomeapi/ohsome-api-metadata-provider.service';
import {UrlHashParamsProviderService} from './app/singelton-services/url-hash-params-provider.service';
import {PRISM_LANGUAGE_OHSOME_FILTER} from './prism-language-ohsome-filter';
import {StateService} from './app/singelton-services/state.service';
import {loadTranslations} from '@angular/localize';

declare const Prism;

export function preparePrismToRenderOhsomeFilterLangauge() {
  // prepare syntax highlighting for ohsome-filter
  return (): void => {
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
      const translationsModule = await import(`./locale/messages.${appLanguage}.json`);
      const translations = translationsModule.default.translations || translationsModule.default;

      loadTranslations(translations);
      console.log(`Loaded translations for locale: ${appLanguage}`);
    } catch (err) {
      console.warn(`Could not load translation file for locale: ${appLanguage}`, err);
    }
  };
}
