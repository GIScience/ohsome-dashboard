import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
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

declare const Prism;

@NgModule({
  declarations: [
    AppComponent,
    QueryPanelComponent,
    ResultPanelComponent,
    ResultListDirective,
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
    OqtModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: urlHashParamsProviderFactory,
      deps: [UrlHashParamsProviderService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: ohsomeApiMetadataProviderFactory,
      deps: [OhsomeApiMetadataProviderService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: ohsomeApiAnnouncementProviderFactory,
      deps: [OhsomeApiMetadataProviderService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: oqtApiMetadataProviderFactory,
      deps: [OqtApiMetadataProviderService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: oqtApiAttributeProviderFactory,
      deps: [OqtApiMetadataProviderService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: preparePrismToRenderOhsomeFilterLangauge,
      multi: true
    },
    provideHttpClient(withInterceptorsFromDi()),
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
