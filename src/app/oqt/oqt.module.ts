import {NgModule} from '@angular/core';
import {OqtApiMetadataProviderService} from './oqt-api-metadata-provider.service';
import {OqtApiService} from './oqt-api.service';
import {OqtResultComponent} from './result/oqt-result.component';
import {IndicatorResultComponent} from './result/indicator-result/indicator-result.component';
import {SharedModule} from '../shared/shared.module';
import {OqtApiQueryFormComponent} from './query-form/oqt-api-query-form/oqt-api-query-form.component';
import {SimpleIndicatorComponent} from './query-form/oqt-api-query-form/simple-indicator/simple-indicator.component';
import {
  AttributeCompletenessIndicatorComponent
} from './query-form/oqt-api-query-form/attribute-completeness-indicator/attribute-completeness-indicator.component';


@NgModule({
  declarations: [
    OqtApiQueryFormComponent,
    SimpleIndicatorComponent,
    AttributeCompletenessIndicatorComponent,
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
    SimpleIndicatorComponent,
    AttributeCompletenessIndicatorComponent,
    OqtResultComponent
  ]
})
export class OqtModule {
}
