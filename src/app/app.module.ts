import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
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

@NgModule({
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
  exports: [
    QueryPanelComponent,
    ResultPanelComponent,
    ResultListDirective
  ],
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function ohsomeApiMetadataProviderFactory(provider: OhsomeApiMetadataProviderService) {
  return () => provider.loadOhsomeMetadata();
}

export function ohsomeApiAnnouncementProviderFactory(provider: OhsomeApiMetadataProviderService) {
  return () => provider.loadOhsomeApiAnnouncement();
}

export function oqtApiMetadataProviderFactory(provider: OqtApiMetadataProviderService) {
  return () => provider.loadOqtApiMetadata().pipe(
    catchError((err, caught) => EMPTY)
  )
}

export function urlHashParamsProviderFactory(provider: UrlHashParamsProviderService) {
  return () => provider.updateHashParamsStoreFromUrl()
}
