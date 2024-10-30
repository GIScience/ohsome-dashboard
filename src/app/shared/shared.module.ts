import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AtLeastOneCheckboxCheckedDirective} from './directives/validation/at-least-one-checkbox-checked.directive';
import {PlotlyChartComponent} from './components/plotly-chart/plotly-chart.component';
import {BoundarySelectInputComponent} from './components/boundary-select-input/boundary-select-input.component';
import {BoundaryInputComponent} from './components/boundary-input/boundary-input.component';


@NgModule({
  declarations: [
    AtLeastOneCheckboxCheckedDirective,
    PlotlyChartComponent,
    BoundarySelectInputComponent,
    BoundaryInputComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    AtLeastOneCheckboxCheckedDirective,
    PlotlyChartComponent,
    BoundarySelectInputComponent,
    BoundaryInputComponent,
  ]
})
export class SharedModule { }
