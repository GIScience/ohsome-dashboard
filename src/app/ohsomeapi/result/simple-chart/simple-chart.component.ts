import { AfterViewInit, Component, ElementRef, Input, inject } from '@angular/core';
import {Chart} from 'chart.js';

declare let $: any;

@Component({
    selector: 'app-simple-chart',
    templateUrl: './simple-chart.component.html',
    styleUrls: ['./simple-chart.component.css'],
    standalone: false
})
export class SimpleChartComponent implements AfterViewInit {
  private elemRef = inject(ElementRef);

  public chart: any;

  @Input() type: string;
  @Input() chartJsData: any;
  @Input() chartJsOptions: any;
  @Input() chartJsPlugins: any;

  ngAfterViewInit(){//
    this.createChart();
  }

  createChart() {
    this.chart = new Chart(this.elemRef.nativeElement.querySelector('canvas'), {
      type: this.type,
      data: this.chartJsData,
      options: this.chartJsOptions || Chart.defaults['doughnut'],
      plugins: this.chartJsPlugins
    });
  }
}
