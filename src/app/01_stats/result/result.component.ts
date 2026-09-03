import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  HostBinding,
  inject,
  input,
  OnInit,
  signal,
  Type
} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {NgClass, NgComponentOutlet, ViewportScroller} from '@angular/common';
import {OhsomeApi} from '@giscience/ohsome-js-utils';

import moment from 'moment';
import {QueryHandler, timeSeriesHandler} from '../queryHandler/TimeSeriesHandler';
import {FeaturesError, OhsomeApiV2Service} from '../../ohsomeapi/ohsome-api-v2.service';
import {toPolygonFeatures} from '../../shared/utils/boundaries.utils';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';
import {groupByTagHandler} from '../queryHandler/GroupByTagHandler';
import {StateService} from '../../singelton-services/state.service';
import {getMeasureLabel} from '../../shared/utils/form.utils';
import Response = OhsomeApi.v1.response.Response;
import GroupByResponse = OhsomeApi.v1.response.GroupByResponse;

declare const $: any;

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, /*SimpleGroupbyResultComponent,*/ /*OshdbModule,*/ NgComponentOutlet]
})
export class ResultComponent implements OnInit, AfterViewInit/*, AfterContentInit*/ {
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

  public error: FeaturesError;
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
  private handler = computed(() => {
    const handler = this.queryHandlerRegistry.find(h => h.matches(this.formValues()));
    if (!handler) {
      throw new Error('No ResultHandler matches the current form values');
    }
    return handler as QueryHandler<any>;
  });

  //create boundary feautures as geojson with display_names
  aoiPolygons = computed(() => {
    return toPolygonFeatures(this.formValues());
  })


  constructor() {
    this.changeDetectorRef.detach();
    this.viewportScroller.setOffset([0, 100]);
  }

  ngOnInit() {

    this.unit = OhsomeApi.v1.format.Unit.getUnitByMeasure(this.formValues().measure);

    this.isLoading = true;

    setTimeout(() => {
      this.getData()
    }, 0);
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {

    $('app-result .ui.dropdown').dropdown();
    this.viewportScroller.scrollToAnchor(this.divId);
  }

  onClose() {
    this.componentRef.destroy();
  }

  queryHandlerRegistry: QueryHandler<unknown>[] = [
    groupByTagHandler,
    timeSeriesHandler
  ];


  getData() {
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();
    this.handler().execute(this.formValues(), this.aoiPolygons(), this.ohsomeApiV2, this.oqtApiMetadataProviderService).subscribe({
      next: (response) => {
        this.handlerComponent.set(this.handler().component);
        this.handlerInputs.set(this.handler().toInputs(response, this.formValues()));
        this.data = response;
        this.changeDetectorRef.detectChanges();
      },
      error: (err: FeaturesError) => {
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

  boundaryLabel = computed(() => {
    return this.handler().toBoundaryLabel(this.formValues(), this.aoiPolygons());
  });


  // for download links

  getJSONDataURL(): SafeUrl {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], {type: 'application/json'});
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  }

  getCSVDataURL(): SafeUrl {
    if (this.data) {
      const csv = this.handler().toCSV(this.data);
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
  protected readonly getMeasureLabel = getMeasureLabel;
}
