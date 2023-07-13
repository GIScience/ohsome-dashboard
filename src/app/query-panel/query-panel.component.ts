import {AfterViewChecked, Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DataService} from '../singelton-services/data.service';
import {propEach} from '@turf/meta';
import envelope from '@turf/envelope';
import centroid from '@turf/centroid';
import {getCoord} from '@turf/invariant';

import {OhsomeApiMetadataProviderService} from '../oshdb/ohsome-api-metadata-provider.service';
import {Feature, Polygon} from 'geojson';
import {environment} from '../../environments/environment';
import {BoundarySelectInputComponent} from '../shared/components/boundary-select-input/boundary-select-input.component';
import {BoundaryInputComponent} from '../shared/components/boundary-input/boundary-input.component';
import {LatLngBoundsExpression} from 'leaflet';
import {feature, Properties} from '@turf/helpers';
import {BoundaryType} from '../shared-types';
import Utils from '../../utils';
import {UrlHashParamsProviderService} from '../singelton-services/url-hash-params-provider.service';
import {OqtApiMetadataProviderService} from '../oqt/oqt-api-metadata-provider.service';
import {OsmBoundaryProviderService} from '../singelton-services/osm-boundary-provider.service';


declare let $: any;

@Component({
  selector: 'app-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.css'],
})
export class QueryPanelComponent implements AfterViewChecked {

  @ViewChild('f', {static: true})
  form: NgForm;
  @ViewChild('bsi', {static: false})
  mapInput: BoundarySelectInputComponent | BoundaryInputComponent;

  public hashParams: URLSearchParams;

  // default map settings
  public maskPoly;
  public zoom = environment.zoomLevel;
  public minZoom = 0;
  public maxBounds: LatLngBoundsExpression = [[-90, -180], [90, 180]];
  public mapCenter = environment.mapCenter;
  public bboxes = '';
  public bcircles = '';
  public bpolys = '';
  private _adminBoundaries = ''; //contains the current FeatureCollection from ngModel
  private _boundaryType: BoundaryType = 'admin';

  private _selectedNames: string[] = [];
  public activeBackend: 'ohsomeApi' | 'oqtApi' = 'ohsomeApi';

  constructor(
    private dataService: DataService,
    private metadataProvider: OhsomeApiMetadataProviderService,
    private oqtApiMetadataProviderService: OqtApiMetadataProviderService,
    private urlHashParamsProviderService: UrlHashParamsProviderService,
    private osmBoundaryProviderService: OsmBoundaryProviderService
  ) {
    this.maskPoly = feature(this.metadataProvider.getOhsomeMetadataResponse().extractRegion.spatialExtent);

    // Code is not necessary for global dataset
    if (environment.mapCenterFromPoly && typeof this.maskPoly === 'object') {
      const _envelope: Feature<Polygon> = envelope(this.maskPoly);
      const _center = centroid(_envelope);
      const _coord = getCoord(_center);
      this.mapCenter = {lat: _coord[1], lng: _coord[0]};
    }

    //precedence: hashParams over environment over default

    // settings from hash
    this.hashParams = urlHashParamsProviderService.getHashURLSearchParams();

    // settings from hash: activate the right query panel
    const backendValue = this.hashParams.get('backend');
    this.activeBackend = (backendValue === 'ohsomeApi' || backendValue === 'oqtApi') ? backendValue : 'ohsomeApi';
    // settings from hash: map setttings for ohsomeApi AND oqtApi
    this.bboxes = Utils.getFromParamsOrDefault(this.hashParams, 'bboxes', Utils.loadEnv('bboxes', this.bboxes));
    this.bcircles = Utils.getFromParamsOrDefault(this.hashParams, 'bcircles', Utils.loadEnv('bcircles', this.bcircles));
    this.bpolys = Utils.getFromParamsOrDefault(this.hashParams, 'bpolys', Utils.loadEnv('bpolys', this.bpolys));
    this._boundaryType = this.getBoundaryTypeFromHashParams(this.hashParams) || Utils.loadEnv('boundaryType', this._boundaryType);
    const ids =  this.hashParams.get('adminids')?.split(',').map(Number);
    this.osmBoundaryProviderService.getOsmBoundariesByIds(ids)
      .subscribe({
        next: (featureCollectionOrEmpty:string) => {
          this.adminBoundaries = featureCollectionOrEmpty;

          // immediately trigger the query if there are hashparams
          if (window.location.hash) {
            setTimeout(() => {
              if (this.form.form.valid) {
                this.onSubmit();
              }
            });
          }
        }
      });
  }

  private getBoundaryTypeFromHashParams(hashParams: URLSearchParams): BoundaryType | undefined {
    let boundaryType: BoundaryType | undefined = undefined;
    if (hashParams.get('bboxes')) {
      boundaryType = 'bbox';
    } else if (hashParams.get('bcircles')) {
      boundaryType = 'bcircle';
    } else if (hashParams.get('bpolys')) {
      boundaryType = 'bpoly';
    } else if (hashParams.get('adminids')) {
      boundaryType = 'admin';
    }
    return boundaryType;
  }

  get getFormAsString() {
    return JSON.stringify(this.form.value, null, 2);
  }

  get boundaryType(): BoundaryType {
    return this._boundaryType;
  }

  set boundaryType(value: BoundaryType) {
    this.mapCenter = this.mapInput.map.getCenter();
    this.zoom = this.mapInput.map.getZoom();
    this._boundaryType = value;
  }

  get adminBoundaries(): string {
    return this._adminBoundaries;
  }

  set adminBoundaries(value: string) {
    this._adminBoundaries = value;
  }

  get selectedNames(): string[] {
    if (this.form.controls['bpolys'] && this.boundaryType === 'admin') {
      this._selectedNames = this.getSelectedPropertyValues('name').map(String);
      return this._selectedNames;
    }
    return [];
  }

  public getSelectedPropertyValues(propertyName: string) {
    if (!this.form.controls['bpolys'].value || this.form.controls['bpolys'].value === '') {
      return [];
    }

    const selectedPropertyvalues: Properties[] = [];

    propEach(JSON.parse(this.form.controls['bpolys'].value), (properties, featureIndex) => {
      if (properties) {
        if (propertyName in properties) {
          selectedPropertyvalues.push(properties[propertyName]);
        }
      }
    });

    return selectedPropertyvalues;
  }

  getPermalinkParamsFromFormValues(formValue): Record<any, any> {
    const permalinkParams = {...formValue};

    // set osm boundary id
    // admin and bpoly will send bpolys param to backend but for admin we only want to store the ids in the permalink
    if (this.boundaryType === 'admin') {
      // delete bpolys and add adminIds
      // replace geojson with id
      permalinkParams.adminids = this.getSelectedPropertyValues('id').join(',');
      delete permalinkParams.bpolys;
    }

    // transform indicator checkboxes to list
    if (this.activeBackend === 'oqtApi') {
      //get indicators to be queried
      const potentialIndicators = Object.keys(this.oqtApiMetadataProviderService.getOqtApiMetadata().result.indicators);
      const indicatorsToBeQueried: string[] = [];
      // search for the indicators that have been checked in the form
      potentialIndicators.forEach(potIndicator => {
        if (formValue[potIndicator]) {
          indicatorsToBeQueried.push(potIndicator);
        }
      });
      permalinkParams.indicators = indicatorsToBeQueried.join(',');
      potentialIndicators.forEach(indicator => delete permalinkParams[indicator]);
    }

    return permalinkParams;
  }

  ngAfterViewChecked() {
    if (this.mapInput) {
      this.mapInput.map.invalidateSize();
    }
  }

  onSubmit() {
    console.log('Form Value', this.form.value);
    const permalinkParams = this.getPermalinkParamsFromFormValues(this.form.value);
    this.urlHashParamsProviderService.updateHashParams(permalinkParams);
    this.dataService.pushFormValues(this.form.value, this._boundaryType);
  }


  setWhichApi(activeApi: 'ohsomeApi' | 'oqtApi') {
    this.activeBackend = activeApi;
    if (activeApi === 'oqtApi' && this.boundaryType === 'bcircle') {
      this.boundaryType = 'admin';
    }
  }

  removeAdminBoundary(event: MouseEvent) {
    const featureIndex = event.currentTarget?.['dataset']['featureIndex'];
    const featureCollection = JSON.parse(this.adminBoundaries);
    featureCollection.features.splice(featureIndex, 1);
    if(featureCollection.features.length === 0){
      this.adminBoundaries = '';
    } else {
      this.adminBoundaries = JSON.stringify(featureCollection);
    }

  }

  protected readonly window = window;
}
