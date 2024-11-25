import {NgModule} from '@angular/core';
import {OqtApiMetadataProviderService} from './oqt-api-metadata-provider.service';
import {OqtApiService} from './oqt-api.service';
import {OqtResultComponent} from './result/oqt-result.component';
import {IndicatorResultComponent} from './result/indicator-result/indicator-result.component';
import {SharedModule} from '../shared/shared.module';
import {OqtApiQueryFormComponent} from './query-form/oqt-api-query-form/oqt-api-query-form.component';
import {SimpleIndicatorComponent} from './query-form/oqt-api-query-form/simple-indicator/simple-indicator.component';
import {
  AttributeCompletenessAttributesComponent
} from './query-form/oqt-api-query-form/attribute-completeness-attributes/attribute-completeness-attributes.component';
import {PrismEditorComponent} from '../shared/components/prism-editor/prism-editor.component';


@NgModule({
  declarations: [
    OqtApiQueryFormComponent,
    SimpleIndicatorComponent,
    AttributeCompletenessAttributesComponent,
    OqtResultComponent,
    IndicatorResultComponent,
  ],
  imports: [
    SharedModule,
    PrismEditorComponent,
  ],
  providers: [
    OqtApiMetadataProviderService,
    OqtApiService
  ],
  exports: [
    OqtApiQueryFormComponent,
    SimpleIndicatorComponent,
    AttributeCompletenessAttributesComponent,
    OqtResultComponent
  ]
})
export class OqtModule {
}
