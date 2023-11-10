import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {OhsomeApiService} from '../ohsome-api.service';
import {ViewportScroller} from '@angular/common';
import {ChartData, ChartHoverOptions, ChartPoint, ChartTooltipOptions} from 'chart.js';
import {OhsomeApi} from '@giscience/ohsome-js-utils';

import * as moment from 'moment';
import Utils from '../../../utils';
import {UrlHashParamsProviderService} from '../../singelton-services/url-hash-params-provider.service';
import GroupByResponseJSON = OhsomeApi.v1.format.GroupByResponseJSON;
import ResponseJSON = OhsomeApi.v1.format.ResponseJSON;
import SimpleResponseJSON = OhsomeApi.v1.format.SimpleResponseJSON;
import Response = OhsomeApi.v1.response.Response;
import SimpleResponse = OhsomeApi.v1.response.SimpleResponse;
import GroupByResponse = OhsomeApi.v1.response.GroupByResponse;
import {RequiredAndDefined} from '../../shared/shared-types';

declare let $: any;

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit, AfterViewInit {

  public componentRef;
  public moment = moment;
  @HostBinding('id') public divId: string = 'result' + '_' + Date.now().toString();
  public title = '';
  public unit = '';
  public creationDate: string = new Date().toUTCString();
  public formValues: any;
  public boundaryType: string;
  private data: any;
  public response: Response;
  public simpleResponse: SimpleResponse;
  public groupByResponse: GroupByResponse;
  public responseType: string;
  public permalink: SafeUrl;

  public error: any;
  public isLoading = false;

  private simpleRequestColor = '#6EB0E0';

  public chartJsData: RequiredAndDefined<ChartData>;

  public chartJsOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {line: {tension: 0}},
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'linear'
      }],
      yAxes: [{
        scaleLabel: {
          display: false,
          labelString: ''
        },
        ticks: {
          callback: this.yAxesFormatter.bind(this),
          beginAtZero: true
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

  public chartJsDataStart: any = null;
  public chartJsDataEnd: any = null;

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

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private restApi: OhsomeApiService,
              private urlHashParamsProviderService: UrlHashParamsProviderService,
              private viewportScroller: ViewportScroller,
              private elemRef: ElementRef,
              private sanitizer: DomSanitizer) {
    changeDetectorRef.detach();
    viewportScroller.setOffset([0, 100]);
  }

  ngOnInit() {
    // console.log('result', this.formValues);
    this.permalink = this.getPermalink();
    this.setTitle();
    this.unit = OhsomeApi.v1.format.Unit.getUnitByMeasure(this.formValues.measure);
    this.getData();
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    $('.ui.dropdown').dropdown();
    console.log(this.divId);
    this.viewportScroller.scrollToAnchor(this.divId);
  }

  onClose() {
    this.componentRef.destroy();
  }

  // Set the chart legend title
  setTitle() {
    //simple filter
    if (this.formValues.keys) {
      // simple request
      this.title = `${(this.formValues.keys) ? this.formValues.keys : '*'}=${(this.formValues.values) ? this.formValues.values : '*'}`;
    } else if (this.formValues.filter) {
      const filter = this.formValues.filter;
      //limit string length to a maximum
      const maxLength = 80;
      this.title = (filter.length > maxLength) ? `${filter.slice(0, maxLength)} ...` : filter;
    }
  }

  getData() {
    // build request

    // measure
    const urlSegments: string[] = ['elements', this.formValues.measure];

    //TODO use ratio, density or nothing
    // if (this.formValues.???) {
    //   urlSegments.push('density');
    // }

    // groupBy + type, boundary, tag, key or nothing
    if (this.formValues.groupBy !== 'none') {
      urlSegments.push('groupBy', this.formValues.groupBy);
    }

    // build path from segments
    const urlPath = urlSegments.join('/');

    // TODO: could be fetched from swagger api-docs
    const supportedParamKeys = [
      'bboxes', 'bcircles', 'bpolys', 'userids', 'time', 'filter',
      'groupByKey', 'groupByKeys', 'groupByValues', 'showMetadata'
    ];

    const params: any = {'showMetadata': true};
    for (const key in this.formValues) {
      if (supportedParamKeys.includes(key) && !!this.formValues[key]) {
        params[key] = this.formValues[key];
      }
    }

    if (!this.formValues.filter) {
      // migrate "simple" filters (types + key=value) to OSHDB filter
      const typesPart = this.formValues.types.map(t => 'type:' + t).join(' or ');
      const escapeQuotes = s => `"${s.replace(/"/g, '\\"')}"`;

      params.filter = '(' + typesPart + ')';
      if (this.formValues.key) {
        if (this.formValues.value) {
          params.filter += ' and ' + escapeQuotes(this.formValues.key) + '='
            + escapeQuotes(this.formValues.value);
        } else {
          params.filter += ' and ' + escapeQuotes(this.formValues.key) + '=*';
        }
      }
    }

    // now add the params
    const urlSearchParams = new URLSearchParams();
    for (const param in params) {
      urlSearchParams.set(param, params[param]);
    }

    // start request
    this.isLoading = true;
    this.restApi.post(urlPath, urlSearchParams.toString())
      .subscribe(
        {
          next: (data) => {
            console.log(data);
            this.data = data;

            if (SimpleResponse.isSimpleResponseJSON(data as ResponseJSON)) {
              this.responseType = 'simpleResponse';
              this.response = this.simpleResponse = new SimpleResponse(data as SimpleResponseJSON);
              this.chartJsData = this.createChartJsData(data as ResponseJSON);
              this.chartJsDataStart = this.getChartJsDataAtIndex(0);
              this.chartJsDataEnd = this.getChartJsDataAtIndex(this.simpleResponse.getResult().length - 1);
            } else if (GroupByResponse.isGroupByResponseJSON(data as ResponseJSON)) {
              this.responseType = 'groupByResponse';
              this.response = this.groupByResponse = new GroupByResponse(data as GroupByResponseJSON);
              return;
            } else {
              throw new TypeError('Response::create(): This ResponseJSON format is currently not supported');
            }

          },
          error: (err) => {
            this.isLoading = false;
            this.error = err;
            console.error(this.error);
            this.changeDetectorRef.detectChanges();
          },
          complete: () => {
            console.log('loading done');
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
          }
        }
      );
  }

  createChartJsData(ohsomeApiResponse: ResponseJSON): RequiredAndDefined<ChartData> {
    const chartData: RequiredAndDefined<ChartData> = {
      labels: [],
      datasets: []
    };

    chartData.datasets.push({});
    // chartData.datasets[0].borderColor = this.simpleRequestColor;
    chartData.datasets[0].backgroundColor = this.simpleRequestColor;
    chartData.datasets[0].pointStyle = 'cross';
    chartData.datasets[0].pointRadius = 0;
    chartData.datasets[0].fill = true;
    chartData.datasets[0].pointHoverRadius = 5;
    chartData.datasets[0].pointHoverBorderColor = 'blue';
    chartData.datasets[0].pointHoverBorderWidth = 2;

    if (SimpleResponse.isSimpleResponseJSON(ohsomeApiResponse)) {
      const simpleResponse = new SimpleResponse(ohsomeApiResponse);

      chartData.datasets[0].label = this.title;
      chartData.datasets[0].data = simpleResponse.result.map((tv) => ({x: tv.timestamp, y: tv.value}));
    } else {
      throw new Error('unknown result type in OSHDB response. ' + JSON.stringify(ohsomeApiResponse));
    }
    return chartData;
  }

  public getChartJsDataAtIndex(index: number) {
    const dataAt: any[] = [];

    this.chartJsData.datasets.forEach(
      (dataset) => {
        if (dataset.data) {
          dataAt.push(dataset.data[index]);
        }
      }
    );

    return dataAt;
  }

  private yAxesFormatter(value, index, values) {
    const unitFactor = this.UNITS[this.unit].factor;
    if (values[0] > unitFactor) {
      return value / unitFactor + ' k' + this.unit;
    } else {
      return parseFloat(value.toFixed(1)) + ' ' + this.unit;
    }
  }

  // private labelFormatter(tooltipItem: ChartTooltipItem, data: ChartData) {
  private labelFormatter(tooltipItem: any, data: any) {
    const timestamp = (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] as ChartPoint).x;
    const yValue = (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] as ChartPoint).y;

    return this.moment(timestamp).format('YYYY-MM-DD') + ': ' + this.kFormatter(parseFloat(yValue ? yValue.toString() : ''), this.unit);
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


  getSelectedNames(): string {
    const values: any[] = [];
    let inputValues = '';
    if (this.formValues.bpolys) {
      let bpolys = this.formValues.bpolys;
      let isJson = false;
      try {
        bpolys = JSON.parse(bpolys);
        isJson = true;
      } catch (e) {
        console.log('Bpoly is no JSON');
      }
      if (isJson) {
        if (bpolys.features === undefined) {
          return '';
        }
        values.push(bpolys.features.map((feature: any) => {
          return Utils.sanitizeLabel(feature.id);
        }));
      } else {
        inputValues = bpolys;
      }
    } else if (this.formValues.bcircles) {
      inputValues = this.formValues.bcircles;
    } else if (this.formValues.bboxes) {
      inputValues = this.formValues.bboxes;
    }
    inputValues.split('|').forEach(function (val) {
      if (val.includes(':')) {
        values.push(val.split(':')[0]);
      }
    });
    return values.join(', ');
  }

  // for download links

  getJSONDataURL(): SafeUrl {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], {type: 'application/json'});
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  }

  getCSVDataURL(): SafeUrl {
    if (this.response) {
      const csv = this.response.toCSV();
      const blob = new Blob([csv], {type: 'text/csv'});
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    } else {
      return '';
    }
  }

  getPermalink(): SafeUrl {
    return '#' + this.urlHashParamsProviderService.getHashURLSearchParams().toString();
  }

  showPermalink(event): void {
    event.preventDefault();
    $('#permalinkModal').modal('show');
    $('#permalink')[0].value = window.location.href.replace(window.location.hash, '') + this.permalink;
  }

  protected readonly GroupByResponse = GroupByResponse;
}
