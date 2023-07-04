import {NgModule} from '@angular/core';
import {OqtApiMetadataProviderService} from './oqt-api-metadata-provider.service';
import {OqtApiService} from './oqt-api.service';
import {OqtResultComponent} from './result/oqt-result.component';
import {IndicatorResultComponent} from './result/indicator-result/indicator-result.component';
import {SharedModule} from '../shared/shared.module';
import {OqtApiQueryFormComponent} from './query-form/oqt-api-query-form/oqt-api-query-form.component';


@NgModule({
  declarations: [
    OqtApiQueryFormComponent,
    OqtResultComponent,
    IndicatorResultComponent,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    OqtApiMetadataProviderService,
    OqtApiService
  ],
  exports: [
    OqtApiQueryFormComponent,
    OqtResultComponent
  ]
})
export class OqtModule {
}
