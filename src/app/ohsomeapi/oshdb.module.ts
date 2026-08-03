import {NgModule} from '@angular/core';
import {SimpleChartComponent} from '../01_stats/result/simple-chart/simple-chart.component';
import {SimpleGroupbyResultComponent} from '../01_stats/result/simple-groupby-result/simple-groupby-result.component';
import {NgDatePipesModule} from 'ngx-pipes';
import {TimePeriodPickerInputComponent} from './query-form/time-period-picker-input/time-period-picker-input.component';
import {OhsomeApiQueryFormComponent} from './query-form/ohsome-api-query-form/ohsome-api-query-form.component';


@NgModule({
    imports: [
    NgDatePipesModule,
    SimpleChartComponent,
    SimpleGroupbyResultComponent,
    TimePeriodPickerInputComponent,
    OhsomeApiQueryFormComponent,
],
    exports: [
        OhsomeApiQueryFormComponent,
        SimpleChartComponent,
        SimpleGroupbyResultComponent,
    ],
    providers: [
    ]
})
//TODO remove OSHDB Module completely, first remove from tests
export class OshdbModule {
}
