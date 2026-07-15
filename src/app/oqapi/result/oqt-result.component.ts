import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  HostBinding,
  inject,
  OnInit
} from '@angular/core';
import {NgClass, ViewportScroller} from '@angular/common';
import {FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import {OqtApiMetadataProviderService} from '../oqt-api-metadata-provider.service';
import {MetadataResponseJSON} from '../types/MetadataResponseJSON';
import {OhsomeApi} from '@giscience/ohsome-js-utils';
import {featureCollection} from '@turf/helpers';
import Utils from '../../../utils';
import {SafeUrl} from '@angular/platform-browser';
import {UrlHashParamsProviderService} from '../../singelton-services/url-hash-params-provider.service';
import {IndicatorParams, Params} from '../types/types'
import {IndicatorResultComponent} from './indicator-result/indicator-result.component';
import {
  categoryRegistry,
  thematicAccuracyCategoryNamesForBlank,
  thematicCategoryType
} from '../query-form/oqt-api-query-form/thematic-accuracy-indicator/thematic-accuracy-indicator.constants';
import {toPolygonFeatures, unionPolygonFeatures} from '../../shared/utils/boundaries.utils';

declare const $: any;

@Component({
  selector: 'app-oqt-result',
  templateUrl: './oqt-result.component.html',
  styleUrls: ['./oqt-result.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgClass, IndicatorResultComponent]
})
export class OqtResultComponent implements OnInit, AfterViewInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  protected urlHashParamsProviderService = inject(UrlHashParamsProviderService);
  private viewportScroller = inject(ViewportScroller);
  protected oqtApiMetadataProviderService = inject(OqtApiMetadataProviderService);

  @HostBinding('id') public divId: string = 'result' + '_' + Date.now().toString();
  formValues: {
    topic: string;
    bpolys?: string;
    bbox?: string;
    [formFieldName: string]: string | string[] | boolean | undefined;
  };
  boundaryType: string;
  componentRef: ComponentRef<OqtResultComponent>;

  metadata: MetadataResponseJSON;

  title = '';

  isLoading = false;

  indicatorList: IndicatorParams[]

  boundaries: FeatureCollection<Polygon | MultiPolygon>;

  permalink: SafeUrl;

  thematicAccuracyCategories = categoryRegistry;

  thematicAccuracyCategoryType = thematicCategoryType

  constructor() {
    this.metadata = this.oqtApiMetadataProviderService.getOqtApiMetadata();
    this.changeDetectorRef.detach();
    this.viewportScroller.setOffset([0, 100]);
  }

  ngOnInit(): void {
    this.permalink = this.getPermalink();

    // associate params from formValues to their indicator and store them in a list to be distributed into distict indicator requests
    this.indicatorList = this.createIndicatorListWithParams();

    const unifiedFeature = unionPolygonFeatures(toPolygonFeatures(this.formValues));
    this.boundaries = featureCollection([unifiedFeature]);

    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    this.viewportScroller.scrollToAnchor(this.divId);
  }

  onClose() {
    this.componentRef.destroy();
  }

  getPermalink(): SafeUrl {
    return '#' + this.urlHashParamsProviderService.getHashURLSearchParams().toString();
  }

  showPermalink(event: MouseEvent): void {
    event.preventDefault();
    $('#permalinkModal').modal('show');
    $('#permalink')[0].value = window.location.href.replace(window.location.hash, '') + this.permalink;
  }

  createIndicatorListWithParams(): IndicatorParams[] {
    //get indicators to be queried
    const potentialIndicators = Object.keys(this.metadata.result.indicators);
    const indicatorsToBeQueried: string[] = [];

    // search for the indicators that have been checked in the form
    potentialIndicators.forEach(potIndicator => {
      if (this.formValues[potIndicator]) {
        indicatorsToBeQueried.push(potIndicator);
      }
    });

    return indicatorsToBeQueried.reduce<IndicatorParams[]>((current, indicator) => {

      let params: Params = Object.entries(this.formValues)
        .filter(
          (entry): entry is [string, string | string[] | boolean] =>
            entry[1] !== undefined
        )
        .filter(([key]) => {
          return key.startsWith(`${indicator}--`);
        }).map(([key, value]) => {
          return {[key.replace(`${indicator}--`, '')]: value}
        }).reduce((acc, param) => {
          return {...acc, ...param} as Params;
        }, {});

      const indicatorParams = (Object.keys(params).length === 0) ? null : params;

      current.push({"key": indicator, "value": {"params": indicatorParams}});
      return current;
    }, []);

  }

  getThematicAccuracyLabel(topicKey: string): string | null {
    const key = String(this.formValues?.[topicKey + '--' + this.thematicAccuracyCategoryType[topicKey]]);
    console.log(topicKey + '--' + this.thematicAccuracyCategoryType[topicKey])
    return key && this.thematicAccuracyCategories[topicKey][key]
      ? this.thematicAccuracyCategories[topicKey][key].name
      : thematicAccuracyCategoryNamesForBlank[topicKey];
  }

  protected readonly Utils = Utils;
  protected readonly window = window;
  protected readonly String = String;
}
