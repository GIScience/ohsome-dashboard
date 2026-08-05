import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  inject,
  input,
  OnInit,
  signal,
  Type
} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {JsonPipe, NgClass, NgComponentOutlet, ViewportScroller} from '@angular/common';
import {ChartPoint} from 'chart.js';
import {OhsomeApi} from '@giscience/ohsome-js-utils';

import moment from 'moment';
import {QueryHandler, timeSeriesHandler} from '../queryHandler/TimeSeriesHandler';
import {OhsomeApiV2Service} from '../../ohsomeapi/ohsome-api-v2.service';
import {toPolygonFeatures} from '../../shared/utils/boundaries.utils';
import {Feature, MultiPolygon, Polygon} from 'geojson';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';
import {groupByTagHandler} from '../queryHandler/GroupByTagHandler';
import {StateService} from '../../singelton-services/state.service';
import Response = OhsomeApi.v1.response.Response;
import GroupByResponse = OhsomeApi.v1.response.GroupByResponse;

declare const $: any;

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, /*SimpleGroupbyResultComponent,*/ /*OshdbModule,*/ JsonPipe, NgComponentOutlet]
})
export class ResultComponent implements OnInit, AfterViewInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private ohsomeApiV2 = inject(OhsomeApiV2Service)
  private viewportScroller = inject(ViewportScroller);
  private sanitizer = inject(DomSanitizer);
  protected oqtApiMetadataProviderService = inject(OqtApiMetadataProviderService);
  stateService = inject(StateService);


  public componentRef;
  public moment = moment;
  @HostBinding('id') public divId: string = 'result' + '_' + Date.now().toString();
  // public title = '';
  public unit = '';
  public formValues = input.required<any>();
  public boundaryType: string;
  private data: any;
  public response: Response;
  // intit on creation
  readonly permalink: string = window.location.href;

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
    const handler = this.queryHandlerRegistry.find(h => h.matches(this.formValues()));
    if (!handler) {
      throw new Error('No ResultHandler matches the current form values');
    }
    this.handler = handler as QueryHandler<any>;

    //create boundary feautures as geojson
    this.aoiPolygons = toPolygonFeatures(this.formValues());

    // this.setTitle();
    this.unit = OhsomeApi.v1.format.Unit.getUnitByMeasure(this.formValues().measure);

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
  // setTitle() {
  //   //simple filter
  //   if (this.formValues.keys) {
  //     // simple request
  //     this.title = `${(this.formValues.keys) ? this.formValues.keys : '*'}=${(this.formValues.values) ? this.formValues.values : '*'}`;
  //   } else if (this.formValues.filter) {
  //     const filter = this.formValues.filter;
  //     //limit string length to a maximum
  //     const maxLength = 80;
  //     this.title = (filter.length > maxLength) ? `${filter.slice(0, maxLength)} ...` : filter;
  //   }
  // }

  queryHandlerRegistry = [
    groupByTagHandler,
    timeSeriesHandler
  ];


  getData() {
    //new code starts here
    this.isLoading = true;
    this.handler.execute(this.formValues(), this.ohsomeApiV2, this.oqtApiMetadataProviderService, this.aoiPolygons).subscribe({
      next: (response) => {
        this.handlerComponent.set(this.handler.component);
        this.handlerInputs.set(this.handler.toInputs(response, this.formValues()));
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

  //TODO cleanup
  private yAxesFormatter(value, index, values) {
    const unitFactor = this.UNITS[this.unit].factor;
    if (values[0] > unitFactor) {
      return value / unitFactor + ' k' + this.unit;
    } else {
      return parseFloat(value.toFixed(1)) + ' ' + this.unit;
    }
  }

  //TODO cleanup
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
    return this.handler.toBoundaryLabel(this.formValues(), this.aoiPolygons);
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

  showPermalink(event): void {
    event.preventDefault();
    this.stateService.openPermalinkDialog(this.permalink);
  }

  protected readonly GroupByResponse = GroupByResponse;
}
