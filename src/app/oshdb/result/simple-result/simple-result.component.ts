import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {computeGrowthRateCssClass, growthRate, percentFormatter} from '../result.utils';
import {ChartData} from 'chart.js';

@Component({
  selector: 'app-simple-result',
  templateUrl: './simple-result.component.html',
  styleUrls: ['./simple-result.component.css']
})
export class SimpleResultComponent implements OnInit {
  public moment = moment;

  @Input() chartJsData: Required<ChartData>;
  @Input() chartJsOptions: any;
  @Input() chartJsPlugins: any;
  @Input() unit: any;

  public simpleRequestColor = '#6EB0E0';
  public chartJsDataStart: any;
  public chartJsDataEnd: any;
  public UNITS = {
    '': {
      units: ['', 'k'],
      factor: 1000
    },
    'meter': {
      units: ['m', 'km'],
      factor: 1000
    },
    'm': {
      units: ['m', 'km'],
      factor: 1000
    },
    'm²': {
      units: ['㎡', '㎢'],
      factor: 1000000
    }
  };
  public growthRate: null | number;

  ngOnInit() {
    this.chartJsDataStart = this.getChartJsDataAtIndex(0);
    this.chartJsDataEnd = this.getChartJsDataAtIndex(this.chartJsData.datasets[0].data!.length - 1);
    this.growthRate = growthRate(this.chartJsDataStart[0].y, this.chartJsDataEnd[0].y);
  }

  public kFormatter(meter: number, unit: string): string {
    let value = meter;
    let unitString = this.UNITS[unit].units[0]; // 'm';
    const unitFactor = this.UNITS[unit].factor;
    let decimals = 1;
    if (meter >= unitFactor) {
      value = meter / unitFactor;
      unitString = this.UNITS[unit].units[1]; // 'km';
    }
    if (meter >= 100 * unitFactor) {
      decimals = 0;
    }
    return value.toFixed(decimals) + ' ' + unitString;
  }

  public getChartJsDataAtIndex(index: number) {
    const dataAt: any[] = [];

    this.chartJsData.datasets.forEach(
      (dataset) => dataAt.push(dataset.data![index])
    );

    return dataAt;
  }

  public computeGrowthRateCssClass = computeGrowthRateCssClass;
  public percentFormatter = percentFormatter;

}
