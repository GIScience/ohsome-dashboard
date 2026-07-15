import {AfterViewInit, ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
import {ControlContainer, FormsModule, NgForm} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import Utils from '../../../../utils';
import {OhsomeApiMetadataProviderService} from '../../ohsome-api-metadata-provider.service';
import {DatePipe} from '@angular/common';
import {TimePeriodPickerInputComponent} from '../time-period-picker-input/time-period-picker-input.component';
import {NgDatePipesModule} from 'ngx-pipes';

declare const $: any;

@Component({
  selector: 'app-ohsome-api-query-form',
  templateUrl: './ohsome-api-query-form.component.html',
  styleUrls: ['./ohsome-api-query-form.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, TimePeriodPickerInputComponent, DatePipe, NgDatePipesModule]
})

export class OhsomeApiQueryFormComponent implements OnInit/*, AfterViewInit*/ {
  private metadataProvider = inject(OhsomeApiMetadataProviderService);


  @Input() hashParams: URLSearchParams = new URLSearchParams();

  public start;
  public end;
  public period = 'P1M';
  public maxDate: string;
  public minDate: string;
  public time: string;

  viewUpdateTime: boolean = Utils.loadEnv('viewUpdateTime', false);

  // OSM advanced ohsome filter
  public selectedFilter: string;

// Measure
  public measureOptions: { value: string; label: string }[] = [
    {value: 'count', label: $localize`count`},
    {value: 'length', label: $localize`length`},
    {value: 'area', label: $localize`area`}
  ];
  public measure: string;

// GroupBy
  public groupByOptions: { value: string, label: string }[] = [
    {value: 'type', label: $localize`OSM type`},
    {value: 'boundary', label: $localize`boundary`},
    {value: 'tag', label: $localize`tag`},
    {value: 'key', label: $localize`key`}
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

  ngOnInit() {
    // fill form with supplied hashParams
    this.time = this.hashParams.get('time') ?? `${this.start}/${this.end}/${this.period}`;

    this.selectedFilter = Utils.getFromParamsOrDefault(this.hashParams, 'filter', environment.selectedFilter);
    this.measure = Utils.getFromParamsOrDefault(this.hashParams, 'measure', this.measureOptions[0].value);
    this.groupBy = Utils.getFromParamsOrDefault(this.hashParams, 'groupBy', 'none');
    this.groupByKeys = Utils.getFromParamsOrDefault(this.hashParams, 'groupByKeys', '');
    this.groupByKey = Utils.getFromParamsOrDefault(this.hashParams, 'groupByKey', '');
    this.groupByValues = Utils.getFromParamsOrDefault(this.hashParams, 'groupByValues', '');
  }

  // TODO comment in for group by options
  // ngAfterViewInit() {
  //   this.initSemanticUI();
  // }
  //
  // initSemanticUI() {
  // // init group by checkboxes
  //   $('.ui.radio.checkbox').checkbox();
  //   $('.ui.checkbox').checkbox();
  // }

  fireResize() {
    window.dispatchEvent(new Event('resize'));
  }

}

