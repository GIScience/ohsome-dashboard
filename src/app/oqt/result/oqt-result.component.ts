import {AfterViewInit, ChangeDetectorRef, Component, ComponentRef, HostBinding, OnInit} from '@angular/core';
import {ViewportScroller} from '@angular/common';
import {Feature, FeatureCollection, MultiPolygon, Polygon, BBox} from 'geojson';
import {OqtApiMetadataProviderService} from '../oqt-api-metadata-provider.service';
import {MetadataResponseJSON} from '../types/MetadataResponseJSON';
import {OhsomeApi} from '@giscience/ohsome-js-utils';
import {default as union} from '@turf/union';
import {default as bbox2geojson} from '@turf/bbox-polygon';
import {featureCollection, polygon} from '@turf/helpers';
import Utils from '../../../utils';
import {SafeUrl} from '@angular/platform-browser';
import {UrlHashParamsProviderService} from '../../singelton-services/url-hash-params-provider.service';
import {IndicatorParams, Params} from '../types/types'
import Bpolys = OhsomeApi.v1.request.Bpolys;
import { corineLandCoverClassMapLevel2 } from '../query-form/oqt-api-query-form/thematical-accuracy-indicator/thematical-accuracy-indicator.constants';

declare let $: any;

@Component({
    selector: 'app-oqt-result',
    templateUrl: './oqt-result.component.html',
    styleUrls: ['./oqt-result.component.css'],
    standalone: false
})
export class OqtResultComponent implements OnInit, AfterViewInit {
  @HostBinding('id') public divId: string = 'result' + '_' + Date.now().toString();
  formValues: { topic: string; ohsomedb: boolean; [formFieldName: string]: string | string[] | boolean };
  boundaryType: string;
  componentRef: ComponentRef<OqtResultComponent>;

  metadata: MetadataResponseJSON;

  title = '';

  isLoading = false;

  indicatorList: IndicatorParams[]

  boundaries: FeatureCollection<Polygon | MultiPolygon>;

  permalink: SafeUrl;

  corineLandCoverClassMapLevel2 = corineLandCoverClassMapLevel2;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    oqtApiMetadataProviderService: OqtApiMetadataProviderService,
    private urlHashParamsProviderService: UrlHashParamsProviderService,
    private viewportScroller: ViewportScroller) {
    this.metadata = oqtApiMetadataProviderService.getOqtApiMetadata();
    changeDetectorRef.detach();
    viewportScroller.setOffset([0, 100]);
  }

  ngOnInit(): void {
    this.permalink = this.getPermalink();

    // associate params from formValues to their indicator and store them in a list to be distributed into distict indicator requests
    this.indicatorList = this.createIndicatorListWithParams();

    const {bpolys, bboxes}: { topic: string, bpolys?: string, bboxes?: string, bcircles?: string } = this.formValues;

    if (bboxes) {
      const bboxesInstance = new OhsomeApi.v1.request.Bboxes().parse(bboxes);
      const features: Feature<Polygon, { id: string }>[] = bboxesInstance.boundaries.map((bbox, index) => {
        const id = (bbox.id) ? String(bbox.id) : `box ${index + 1}`;
        const coords: BBox = bbox.geometry.split(',').map(Number) as BBox;
        return bbox2geojson(coords, {properties: {id: id}, id: id}) as unknown as Feature<Polygon, { id: string }>;
      });

      const unifiedFeature: Feature<Polygon | MultiPolygon> = this.unionPolygonFeatures(features);
      this.boundaries = featureCollection([unifiedFeature]);

    } else if (bpolys) {
      // bpoly can be a geojson OR a ohsomeApi bpoly format
      // check whether geojson or bpoly-format
      if (Bpolys.isBPolysString(bpolys)) {
        const bpolysInstance = new Bpolys().parse(bpolys);
        const features: Feature<Polygon>[] = bpolysInstance.boundaries.map((bpoly, index) => {
          const id = (bpoly.id) ? String(bpoly.id) : `area ${index + 1}`;
          const coords1d: number[] = bpoly.geometry.split(',').map(Number);

          // transform array of numbers into array of pairs of numbers (coordinates)
          const coords2d: number[][] = [];
          while (coords1d.length) {
            coords2d.push(coords1d.splice(0, 2));
          }
          return polygon([coords2d], {id: id}, {id: id});
        });

        const unifiedFeature: Feature<Polygon | MultiPolygon> = this.unionPolygonFeatures(features);

        this.boundaries = featureCollection([unifiedFeature]);

      } else {
        //geojson

        //merge all features
        const features = JSON.parse(bpolys).features as Feature<MultiPolygon>[];

        const unifiedFeature: Feature<Polygon | MultiPolygon> = features.reduce(
          (previousValue: Feature<Polygon | MultiPolygon>
            , currentValue: Feature<Polygon | MultiPolygon>
            , currentIndex) => {
            if (currentIndex === 0) {
              return currentValue;
            }

            const merged = union(featureCollection([previousValue, currentValue]));
            if (merged != undefined) {
              merged.id = [previousValue.properties?.['display_name'], currentValue.properties?.['display_name']].join(' + ');
              merged.properties = {};
              merged.properties['id'] = merged.id;
              merged.properties['display_name'] = merged.id;
              return merged;
            } else {
              previousValue.id = previousValue.properties?.['display_name'];
              previousValue.properties!['id'] = previousValue.id;
              return previousValue;
            }
          }, features[0]);

        this.boundaries = featureCollection([unifiedFeature]);
      }

    }
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    this.viewportScroller.scrollToAnchor(this.divId);
  }

  onClose() {
    this.componentRef.destroy();
  }

  unionPolygonFeatures(features: Feature<Polygon>[]): Feature<Polygon | MultiPolygon> {
    const unifiedFeature: Feature<Polygon | MultiPolygon> = features.reduce((previousValue: Feature<Polygon | MultiPolygon>, currentValue: Feature<Polygon>, currentIndex) => {
      if (currentIndex === 0) {
        return currentValue;
      }

      const merged = union(featureCollection([previousValue, currentValue]));
      if (merged) {
        merged.id = [previousValue.id || '', currentValue.id || ''].join(' + ');
        if (merged.properties == undefined) {
          merged.properties = {};
        }
        merged.properties['id'] = merged.id;
        return merged;
      } else {
        previousValue.id = previousValue.id || String(currentIndex);
        if (previousValue.properties == undefined) {
          previousValue.properties = {};
        }
        previousValue.properties['id'] = previousValue.id;

        return previousValue;
      }
    }, features[0]);

    return unifiedFeature;
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

      let params: Params = Object.entries<string | string[] | boolean>(this.formValues).filter(([key]) => {
        return key.startsWith(`${indicator}--`);
      }).map(([key, value]) => {
        return {[key.replace(`${indicator}--`, '')]: value}
      }).reduce((acc, param) => {
        return {...acc, ...param};
      }, {});

      params = (Object.keys(params).length === 0) ? null : params;

      current.push({"key": indicator, "value": {"params": params}});
      return current;
    }, []);

  }

  getSelectedCorineLabel(): string | null {
    const key = String(this.formValues?.['land-cover-thematic-accuracy--corine_land_cover_class']);
    return key && this.corineLandCoverClassMapLevel2[key]
      ? this.corineLandCoverClassMapLevel2[key].name
      : null;
  }

  protected readonly Utils = Utils;
  protected readonly window = window;
}
