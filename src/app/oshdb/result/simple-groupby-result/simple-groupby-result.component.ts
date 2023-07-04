import {Component, Input, OnInit} from '@angular/core';
import {ChartData, ChartHoverOptions, ChartPoint, ChartTooltipItem, ChartTooltipOptions} from 'chart.js';
import * as moment from 'moment';
import {OhsomeApi} from '@giscience/ohsome-js-utils';
import Utils from '../../../../utils';
import {computeGrowthRateCssClass, growthRate} from '../result.utils';
import format = OhsomeApi.v1.format;
import GroupByResponse = OhsomeApi.v1.response.GroupByResponse;


@Component({
  selector: 'app-simple-groupby-type-result',
  templateUrl: './simple-groupby-result.component.html',
  styleUrls: ['./simple-groupby-result.component.css']
})
export class SimpleGroupbyResultComponent implements OnInit {

  @Input() response: GroupByResponse;
  @Input() formValues: any;

  public moment = moment;
  public kFormatter = format.Unit.kFormatter;
  public percentFormatter = format.Unit.percentFormatter;
  private UNITS = format.Unit.UNITS;
  public unit = '';

  public colors = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'];

  public chartJsData: any;
  public chartJsDataStart;
  public chartJsDataEnd;
  private numberOfDatasets: number;
  public chartColumns = "nine wide column";
  public tableColumns = "seven wide column";

  public chartJsOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend:{display: true ,position: 'top'},
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'linear'
      }],
      yAxes: [{
        stacked: true,
        scaleLabel: {
          display: false,
          labelString: ''
        },
        ticks: {
          callback: this.yAxesFormatter.bind(this)
        }
      }]
    },
    hover: {
      mode: 'index',
      intersect: false
    } as ChartHoverOptions,
    tooltips: {
      mode: 'index',
      intersect: false,
      caretPadding: 6,
      callbacks: {
        title: this.titleFormatter.bind(this),
        label: this.labelFormatter.bind(this)
      }
    } as ChartTooltipOptions,
    customVerticalLine: {
      color: 'gray',
      x: undefined
    }
  };

  public chartJsPlugins = [
    {
      afterEvent: function (chart, e) {
        if (/*e.type === 'mousemove' && (e.x > e.chart.chartArea.left)
          && (e.x < e.chart.chartArea.right) &&*/ chart.active && chart.active.length > 0) {
          chart.options.customVerticalLine.x = chart.active[0]._view.x;

        } else {
          chart.options.customVerticalLine.x = undefined;
        }
      },
      beforeDatasetsDraw: function (chart, easing) {
        const ctx = chart.chart.ctx;
        const chartArea = chart.chartArea;
        const x = chart.options.customVerticalLine.x;
        if (!isNaN(x)) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, chartArea.bottom);
          ctx.lineTo(x, chartArea.top);
          ctx.strokeStyle = chart.options.customVerticalLine.color;
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  ];

  ngOnInit() {
    this.unit = format.Unit.getUnitByMeasure(this.formValues.measure);
    this.chartJsData = this.createChartJsData(this.response as GroupByResponse);
    this.chartJsDataStart = this.getChartJsDataAtIndex(0);
    this.chartJsDataEnd = this.getChartJsDataAtIndex(this.response.getResult()[0].result.length - 1);
    this.numberOfDatasets = this.chartJsData.datasets.length;
    this.setLegendOptions(this.numberOfDatasets);
  }

  private setLegendOptions(numberOfDatasets) {
    // default top | chart nine columns wide | table seven columns
    // > 3 and less then 21 and innerWith between 550 to 786 | chart sixteen columns wide | table sixteen columns
    // > 3 and less than 41 right right | chart sixteen columns wide | table sixteen columns
    // > 40 no legend | chart sixteen columns wide | table sixteen columns
    if(numberOfDatasets > 3 && numberOfDatasets <= 40) {
      this.chartColumns = 'sixteen wide column';
      this.tableColumns = 'sixteen wide column';
      this.chartJsOptions.legend.position = 'right';
      this.chartJsOptions.legend.reverse = true;
      if (window.innerWidth < 768 && numberOfDatasets > 10) {
        this.chartJsOptions.legend.display = false;
      }
    } else if (numberOfDatasets > 40) {
      this.chartColumns = 'sixteen wide column';
      this.tableColumns = 'sixteen wide column';
      this.chartJsOptions.legend.display = false;
    }
  }

  private createChartJsData(response: GroupByResponse) {
    // const chartData: ChartData = {labels: [], datasets: []};
    const chartData: Required<ChartData> = {labels: [], datasets: []};

    const datasets = chartData.datasets;

    const groupByResults = this.response.getResult();

    console.log(groupByResults);
    for (let i = 0; i < groupByResults.length; i++) {
      datasets.push({});
      datasets[i].label = Utils.sanitizeLabel(groupByResults[i].groupByObject);
      datasets[i].backgroundColor = datasets[i].borderColor = this.colors[i % this.colors.length];
      datasets[i].pointStyle = 'cross';
      datasets[i].pointRadius = 0;
      datasets[i].fill = true;
      datasets[i].pointHoverRadius = 5;
      datasets[i].pointHoverBorderColor = 'blue';
      datasets[i].pointHoverBorderWidth = 2;
      datasets[i].data = groupByResults[i].result.map((tv) => ({x: tv.timestamp, y: tv.value}));
    }
    return chartData;
  }

  private yAxesFormatter(value, index, values) {
    const unitFactor = this.UNITS[this.unit].factor;
    if (values[0] > unitFactor) {
      return value / unitFactor + ' k' + this.unit;
    } else {
      return parseFloat(value.toFixed(1)) + ' ' + this.unit;
    }
  }

  // private titleFormatter(tooltipItems: ChartTooltipItem, data: ChartData) {
  private titleFormatter(tooltipItems: ChartTooltipItem, data: any) {
    const timestamp = (data.datasets[0].data[tooltipItems[0].index] as ChartPoint).x;
    return this.moment(timestamp).format('YYYY-MM-DD');
  }

  // private labelFormatter(tooltipItem: ChartTooltipItem, data: ChartData) {
  private labelFormatter(tooltipItem: any, data: any) {
    const seriesLabel = (data.datasets[tooltipItem.datasetIndex].label);
    const yValue = (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] as ChartPoint).y;
    if(typeof yValue === 'number'){
      return seriesLabel + ': ' + this.kFormatter(yValue, this.unit);
    } else {
      return seriesLabel + ': ' + yValue;
    }

  }

  public getChartJsDataAtIndex(index: number) {
    const dataAt: any[] = [];

    this.chartJsData.datasets.forEach(
      (dataset) => dataAt.push(dataset.data[index])
    );

    return dataAt;
  }

  public growthRate = growthRate;
  public computeGrowthRateCssClass = computeGrowthRateCssClass;

}
