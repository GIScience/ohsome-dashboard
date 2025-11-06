import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component({
    selector: 'app-plotly-chart',
    templateUrl: './plotly-chart.component.html',
    styleUrls: ['./plotly-chart.component.css'],
})
export class PlotlyChartComponent implements AfterViewInit{
@Input() plotlyDataLayoutConfig: Plotly.PlotlyDataLayoutConfig;
@ViewChild('chart', {static: false}) chartDiv: ElementRef<HTMLDivElement>;

ngAfterViewInit(): void {
    if (!this.plotlyDataLayoutConfig) return;

    const {data, layout, config} = this.plotlyDataLayoutConfig;

    Plotly.newPlot(this.chartDiv.nativeElement,data, layout, config);
  }
}
