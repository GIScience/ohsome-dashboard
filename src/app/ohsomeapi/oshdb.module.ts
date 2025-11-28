import {NgModule} from '@angular/core';
import {OhsomeApiService} from './ohsome-api.service';
import {SimpleChartComponent} from './result/simple-chart/simple-chart.component';
import {SimpleGroupbyResultComponent} from './result/simple-groupby-result/simple-groupby-result.component';
import {SimpleResultComponent} from './result/simple-result/simple-result.component';
import {NgDatePipesModule} from 'ngx-pipes';
import {TimePeriodPickerInputComponent} from './query-form/time-period-picker-input/time-period-picker-input.component';
import {OhsomeApiQueryFormComponent} from './query-form/ohsome-api-query-form/ohsome-api-query-form.component';



@NgModule({
    imports: [
    NgDatePipesModule,
    SimpleChartComponent,
    SimpleGroupbyResultComponent,
    SimpleResultComponent,
    TimePeriodPickerInputComponent,
    OhsomeApiQueryFormComponent,
],
    exports: [
        OhsomeApiQueryFormComponent,
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
