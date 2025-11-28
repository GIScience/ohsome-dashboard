import {NgModule} from '@angular/core';
import {ResultComponent} from './result/result.component';
import {OhsomeApiService} from './ohsome-api.service';
import {SimpleChartComponent} from './result/simple-chart/simple-chart.component';
import {SimpleGroupbyResultComponent} from './result/simple-groupby-result/simple-groupby-result.component';
import {SimpleResultComponent} from './result/simple-result/simple-result.component';
import {NgDatePipesModule} from 'ngx-pipes';
import {TimePeriodPickerInputComponent} from './query-form/time-period-picker-input/time-period-picker-input.component';
import {OhsomeApiQueryFormComponent} from './query-form/ohsome-api-query-form/ohsome-api-query-form.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  imports: [
    SharedModule,
    NgDatePipesModule,
  ],
  declarations: [
    ResultComponent,
    SimpleChartComponent,
    SimpleGroupbyResultComponent,
    SimpleResultComponent,
    TimePeriodPickerInputComponent,
    OhsomeApiQueryFormComponent,
  ],
  exports: [
    OhsomeApiQueryFormComponent,
    ResultComponent,
    SimpleChartComponent,
    SimpleGroupbyResultComponent,
    SimpleResultComponent,
  ],
  providers: [
    OhsomeApiService,
  ]
})
export class OshdbModule {
}
