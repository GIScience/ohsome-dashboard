import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  inject,
  ChangeDetectionStrategy, signal, Type
} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {OhsomeApiService} from '../ohsome-api.service';
import {ViewportScroller, NgClass, JsonPipe, NgComponentOutlet} from '@angular/common';
import {ChartData, ChartHoverOptions, ChartPoint, ChartTooltipOptions} from 'chart.js';
import {OhsomeApi} from '@giscience/ohsome-js-utils';

import moment from 'moment';
import Utils from '../../../utils';
import {OhsomeApiMetadataProviderService} from '../ohsome-api-metadata-provider.service';
import {UrlHashParamsProviderService} from '../../singelton-services/url-hash-params-provider.service';
import GroupByResponseJSON = OhsomeApi.v1.format.GroupByResponseJSON;
import ResponseJSON = OhsomeApi.v1.format.ResponseJSON;
import SimpleResponseJSON = OhsomeApi.v1.format.SimpleResponseJSON;
import Response = OhsomeApi.v1.response.Response;
import SimpleResponse = OhsomeApi.v1.response.SimpleResponse;
import GroupByResponse = OhsomeApi.v1.response.GroupByResponse;
import {RequiredAndDefined} from '../../shared/shared-types';
import {SimpleGroupbyResultComponent} from './simple-groupby-result/simple-groupby-result.component';
import {OshdbModule} from '../oshdb.module';
import {QueryHandler, timeSeriesHandler} from '../queryHandler/TimeSeriesHandler';
import {OhsomeApiV2Service} from '../ohsome-api-v2.service';
import {toPolygonFeatures} from '../../shared/utils/boundaries.utils';
import {Feature, MultiPolygon, Polygon} from 'geojson';

declare const $: any;

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgClass, /*SimpleGroupbyResultComponent,*/ OshdbModule, JsonPipe, NgComponentOutlet]
})
export class ResultComponent implements OnInit, AfterViewInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private ohsomeApiV2 = inject(OhsomeApiV2Service)
  private urlHashParamsProviderService = inject(UrlHashParamsProviderService);
  private viewportScroller = inject(ViewportScroller);
  private sanitizer = inject(DomSanitizer);


  public componentRef;
  public moment = moment;
  @HostBinding('id') public divId: string = 'result' + '_' + Date.now().toString();
  public title = '';
  public unit = '';
  public formValues: any;
  public boundaryType: string;
  private data: any;
  public response: Response;
  public permalink: SafeUrl;

  public error: any;
  public isLoading = false;

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

  protected handlerComponent = signal<Type<unknown> | null>(null);
  protected handlerInputs = signal<{}>({});
  private handler: QueryHandler<any>;
  private aoiPolygons: Feature<Polygon | MultiPolygon>[];


  constructor() {
    this.changeDetectorRef.detach();
    this.viewportScroller.setOffset([0, 100]);
  }

  ngOnInit() {
    const handler = this.queryHandlerRegistry.find(h => h.matches(this.formValues));
    if (!handler) {
      throw new Error('No ResultHandler matches the current form values');
    }
    this.handler = handler as QueryHandler<any>;

    //create boundary feautures as geojson
    this.aoiPolygons = toPolygonFeatures(this.formValues);


    // console.log('result', this.formValues);
    this.permalink = this.getPermalink();
    this.setTitle();
    this.unit = OhsomeApi.v1.format.Unit.getUnitByMeasure(this.formValues.measure);

    this.getData();
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    $('app-result .ui.dropdown').dropdown();
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

  queryHandlerRegistry = [
    timeSeriesHandler
  ]


  getData() {
    //new code starts here
    this.isLoading = true;
    this.handler.execute(this.formValues, this.ohsomeApiV2, this.aoiPolygons).subscribe({
      next: (response) => {
        this.handlerComponent.set(this.handler.component);
        this.handlerInputs.set(this.handler.toInputs(response, this.formValues));
        this.data = response;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err;
        console.error(err);
        this.changeDetectorRef.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    })

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

    return this.handler.toBoundaryLabel(this.formValues, this.aoiPolygons);
  }

  // for download links

  getJSONDataURL(): SafeUrl {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], {type: 'application/json'});
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  }

  getCSVDataURL(): SafeUrl {
    if (this.data) {
      const csv = this.handler.toCSV(this.data);
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
