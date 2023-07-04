import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import Utils from '../../../../utils';
import {OhsomeApiMetadataProviderService} from '../../ohsome-api-metadata-provider.service';

declare let $: any;

@Component({
  selector: 'app-ohsome-api-query-form',
  templateUrl: './ohsome-api-query-form.component.html',
  styleUrls: ['./ohsome-api-query-form.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
})

export class OhsomeApiQueryFormComponent implements OnInit, AfterViewInit {

  @Input() hashParams: URLSearchParams = new URLSearchParams();

  public start;
  public end;
  public period = 'P1M';
  public maxDate: any;
  public minDate: any;
  public time: any;

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
  public measureOptions: string[] = ['count', 'length', 'area', 'perimeter'];
  public measure: string;

  // GroupBy
  public groupByOptions: { value: string, label: string }[] = [
    {value: 'type', label: 'OSM type'},
    {value: 'boundary', label: 'boundary'},
    {value: 'tag', label: 'tag'},
    {value: 'key', label: 'key'}
  ];
  public groupBy: string;
  public groupByKeys: string;
  public groupByKey: string;
  public groupByValues: string;

  constructor(private metadataProvider: OhsomeApiMetadataProviderService) {
    this.minDate = metadataProvider.getOhsomeMetadataResponse().extractRegion.temporalExtent.fromTimestamp;
    this.maxDate = metadataProvider.getOhsomeMetadataResponse().extractRegion.temporalExtent.toTimestamp;
    this.start = Utils.loadEnv('startDate', this.minDate);
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
    this.time = this.hashParams.get('time') || `${this.start}/${this.end}/${this.period}`;

    this.types = (this.hashParams.has('types'))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ? this.hashParams.get('types').split(',')
      : environment.selectedTypes || this.typeOptions;
    this.whichFilter = this.hashParams.get('filter') ? 'advanced' : 'simple';
    this.selectedKey = this.hashParams.get('key') || environment.selectedKey;
    this.selectedValue = this.hashParams.get('value') || environment.selectedValue;
    this.selectedFilter = this.hashParams.get('filter') || environment.selectedFilter;
    this.measure = this.hashParams.get('measure') || this.measureOptions[0];
    this.groupBy = this.hashParams.get('groupBy') || 'none';
    this.groupByKeys = this.hashParams.get('groupByKeys') || '';
    this.groupByKey = this.hashParams.get('groupByKey') || '';
    this.groupByValues = this.hashParams.get('groupByValues') || '';
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

