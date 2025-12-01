import { AfterViewInit, Component, Input, OnInit, inject } from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import {environment} from '../../../../environments/environment';
import Utils from '../../../../utils';
import {OhsomeApiMetadataProviderService} from '../../ohsome-api-metadata-provider.service';
import { NgClass, DatePipe } from '@angular/common';
import { TimePeriodPickerInputComponent } from '../time-period-picker-input/time-period-picker-input.component';
import { NgDatePipesModule } from 'ngx-pipes';

declare let $: any;

@Component({
    selector: 'app-ohsome-api-query-form',
    templateUrl: './ohsome-api-query-form.component.html',
    styleUrls: ['./ohsome-api-query-form.component.css'],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [FormsModule, NgClass, TimePeriodPickerInputComponent, DatePipe, NgDatePipesModule]
})

export class OhsomeApiQueryFormComponent implements OnInit, AfterViewInit {
  private metadataProvider = inject(OhsomeApiMetadataProviderService);


  @Input() hashParams: URLSearchParams = new URLSearchParams();

  public start;
  public end;
  public period = 'P1M';
  public maxDate: string;
  public minDate: string;
  public time: string;

  viewUpdateTime: boolean = Utils.loadEnv('viewUpdateTime', false);

  // OSM type
  public typeOptions: string[] = ['node', 'way', 'relation'];
  public types: string[];

  public whichFilter: 'simple' | 'advanced';
  public selectedKey: string;
  public selectedValue: string;

  // OSM advanced ohsome filter
  public selectedFilter: string;

// Measure
  public measureOptions: { value: string; label: string }[] = [
    { value: 'count', label: $localize`count` },
    { value: 'length', label: $localize`length` },
    { value: 'area', label: $localize`area` },
    { value: 'perimeter', label: $localize`perimeter` }
  ];
  public measure: string;

// GroupBy
  public groupByOptions: { value: string, label: string }[] = [
    { value: 'type', label: $localize`OSM type` },
    { value: 'boundary', label: $localize`boundary` },
    { value: 'tag', label: $localize`tag` },
    { value: 'key', label: $localize`key` }
  ];
  public groupBy: string;
  public groupByKeys: string;
  public groupByKey: string;
  public groupByValues: string;

  constructor() {
    this.minDate = this.metadataProvider.getOhsomeMetadataResponse()?.extractRegion.temporalExtent.fromTimestamp ?? "";
    this.maxDate = this.metadataProvider.getOhsomeMetadataResponse()?.extractRegion.temporalExtent.toTimestamp ?? "";
    this.start = Utils.loadEnv('startDate', '');
    this.end = Utils.loadEnv('endDate', this.maxDate);
    this.period = Utils.loadEnv('period', this.period);
  }

  getMaxDateAsDate() {
    return new Date(this.maxDate);
  }

  setWhichFilter(filterMode: 'simple' | 'advanced') {
    this.whichFilter = filterMode;
    if (filterMode === 'simple') {
      this.initOSMTypeDropdown();
    }
  }

  ngOnInit() {
    // fill form with supplied hashParams
    this.time = this.hashParams.get('time') ?? `${this.start}/${this.end}/${this.period}`;

    this.types = (this.hashParams.has('types'))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ? this.hashParams.get('types').split(',').filter(t => this.typeOptions.includes(t))
      : environment.selectedTypes || this.typeOptions;
    this.whichFilter = this.hashParams.has('filter') ? 'advanced' : 'simple';
    this.selectedKey = Utils.getFromParamsOrDefault(this.hashParams, 'key', environment.selectedKey);
    this.selectedValue = this.hashParams.has('key') || this.hashParams.has('value')
      ? this.hashParams.get('value') ?? ''
      : environment.selectedValue;
    this.selectedFilter = Utils.getFromParamsOrDefault(this.hashParams, 'filter', environment.selectedFilter);
    this.measure = Utils.getFromParamsOrDefault(this.hashParams, 'measure', this.measureOptions[0].value);
    this.groupBy = Utils.getFromParamsOrDefault(this.hashParams, 'groupBy', 'none');
    this.groupByKeys = Utils.getFromParamsOrDefault(this.hashParams, 'groupByKeys', '');
    this.groupByKey = Utils.getFromParamsOrDefault(this.hashParams, 'groupByKey', '');
    this.groupByValues = Utils.getFromParamsOrDefault(this.hashParams, 'groupByValues', '');
  }

  ngAfterViewInit() {
    this.initSemanticUI();
  }

  initSemanticUI() {
    $('.ui.radio.checkbox').checkbox();
    $('.ui.checkbox').checkbox();

    this.initOSMTypeDropdown();
  }

  initOSMTypeDropdown() {
    setTimeout(() => {
      $('select[name=types]')
        .dropdown()
      ;
    }, 500);
  }

  fireResize() {
    window.dispatchEvent(new Event('resize'));
  }

}

