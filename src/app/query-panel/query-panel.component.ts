import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit, signal,
  ViewChild
} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {DataService} from '../singelton-services/data.service';
import {propEach} from '@turf/meta';
import envelope from '@turf/envelope';
import centroid from '@turf/centroid';
import {getCoord} from '@turf/invariant';

import {OhsomeApiMetadataProviderService} from '../ohsomeapi/ohsome-api-metadata-provider.service';
import {Feature, GeoJsonProperties, Polygon} from 'geojson';
import {environment} from '../../environments/environment';
import {BoundarySelectInputComponent} from '../shared/components/boundary-select-input/boundary-select-input.component';
import {BoundaryInputComponent} from '../shared/components/boundary-input/boundary-input.component';
import {LatLngBoundsExpression} from 'leaflet';
import {feature} from '@turf/helpers';
import {BoundaryInputComponentOptions, BoundaryType, isQueryMode, QueryMode, Userlayer} from '../shared/shared-types';
import Utils from '../../utils';
import {UrlHashParamsProviderService} from '../singelton-services/url-hash-params-provider.service';
import {OqtApiMetadataProviderService} from '../oqapi/oqt-api-metadata-provider.service';
import {OsmBoundaryProviderService} from '../singelton-services/osm-boundary-provider.service';
import {Subscription} from 'rxjs';
import bboxPolygon from '@turf/bbox-polygon';
import {
  AtLeastOneCheckboxCheckedDirective
} from '../shared/directives/validation/at-least-one-checkbox-checked.directive';
import {NgClass} from '@angular/common';
import {
  OhsomeApiQueryFormComponent
} from '../ohsomeapi/query-form/ohsome-api-query-form/ohsome-api-query-form.component';
import {OqtApiQueryFormComponent} from '../oqapi/query-form/oqt-api-query-form/oqt-api-query-form.component';
import {AuthService} from "../singelton-services/auth.service";
import {StateService} from '../singelton-services/state.service';

@Component({
  selector: 'app-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AtLeastOneCheckboxCheckedDirective, NgClass, OhsomeApiQueryFormComponent, OqtApiQueryFormComponent, BoundarySelectInputComponent, BoundaryInputComponent]
})
export class QueryPanelComponent implements OnInit, AfterViewChecked, OnDestroy {
  private dataService = inject(DataService);
  protected authService = inject(AuthService);
  ohsomeApiMetadataProviderService = inject(OhsomeApiMetadataProviderService);
  oqtApiMetadataProviderService = inject(OqtApiMetadataProviderService);
  protected urlHashParamsProviderService = inject(UrlHashParamsProviderService);
  protected stateService = inject(StateService);
  private osmBoundaryProviderService = inject(OsmBoundaryProviderService);


  @ViewChild('f', {static: true})
  form: NgForm;
  @ViewChild('bsi', {static: false})
  mapInput: BoundarySelectInputComponent | BoundaryInputComponent;

  // settings from hash
  queryModeSignal = computed<QueryMode>((): QueryMode => {
    const backendParam = this.stateService.appState().queryMode ?? 'ohsomeApi';
    return isQueryMode(backendParam) ? backendParam : 'ohsomeApi';
  });

  public readonly initialHashParams: URLSearchParams;

  // default map settings
  public maskPoly;
  public zoom = environment.zoomLevel;
  public minZoom = 0;
  public maxBounds: LatLngBoundsExpression = [[-90, -180], [90, 180]];
  public mapCenter = environment.mapCenter;
  public bboxes = '';
  public bcircles = '';
  public bpolys = '';
  protected adminBoundaries = signal<string>(''); //contains the current FeatureCollection from ngModel
  //TODO shoud be stored in app state
  private _boundaryType: BoundaryType = 'admin';
  public userDefinedPolygonLayers: Userlayer[] = [];

  public mapOptions: BoundaryInputComponentOptions;

  private _selectedNames: string[] = [];

  private formChangesSubscription: Subscription;

  constructor() {
    const spatialExtent = environment.maskPoly ?? bboxPolygon([-180, -90, 180, 90]).geometry;
    this.maskPoly = feature(spatialExtent);


    // Code is not necessary for global dataset
    if (environment.mapCenterFromPoly && typeof this.maskPoly === 'object') {
      const _envelope: Feature<Polygon> = envelope(this.maskPoly);
      const _center = centroid(_envelope);
      const _coord = getCoord(_center);
      this.mapCenter = {lat: _coord[1], lng: _coord[0]};
    }

    //precedence: hashParams over environment over default

    // settings from URL hashparams
    this.initialHashParams = this.stateService.initialHashParams;
    console.log("QP constructor hashParams: " + this.initialHashParams);

    // settings from hash: map setttings for ohsomeApi AND oqtApi
    this.bboxes = Utils.getFromParamsOrDefault(this.initialHashParams, 'bboxes', Utils.loadEnv('bboxes', this.bboxes));
    this.bpolys = Utils.getFromParamsOrDefault(this.initialHashParams, 'bpolys', Utils.loadEnv('bpolys', this.bpolys));
    this._boundaryType = this.getBoundaryTypeFromHashParams(this.initialHashParams) ?? Utils.loadEnv('boundaryType', this._boundaryType);

    this.mapOptions = {
      center: this.mapCenter,
      zoom: this.zoom,
      minZoom: this.minZoom,
      maxBounds: this.maxBounds,
      maskPoly: this.maskPoly,
      userDefinedPolygonLayers: this.userDefinedPolygonLayers
    }

    const ids = this.initialHashParams.get('adminids')?.split(',').map(Number);
    this.osmBoundaryProviderService.getOsmBoundariesByIds(ids)
      .subscribe({
        next: (featureCollectionOrEmpty: string) => {
          this.adminBoundaries.set(featureCollectionOrEmpty);

          // immediately trigger the query if there are hashparams
          if (this.stateService.appState().firstForm) {
            this.stateService.updatePartialState({firstForm: false});
            setTimeout(() => {
              console.log("FORM VALID", this.form.form.valid)
              if (this.form.form.valid) {
                this.onSubmit();
              }
            }, 1000);
          }
        }
      });

  } // constructor end

  onChangeIndicatorCoverages($event: Userlayer[]) {

    //show additional data on the maps (e.g. coverage of comparison data in OSMAnalysis tab for specific indicators)
    /*
    1. listen to Output from oqt-panel indicator (activated indicator having GeoJSON coverage geom)
    2. Qot should already use turf mask to create the final geom, color etc. infos for userDefinedPolygonLayer
    3. Add to a list of userDefined Layers on this component and pass it as Input option to the maps
     */

    // Note: changing a single property of an @Input Object doesn't trigger change detection, so updating the whole
    // mapOptions Object is necessary
    this.mapOptions = {...this.mapOptions, userDefinedPolygonLayers: $event};
  }

  ngOnInit() {
    // runs on every form change
    // TODO remove
    this.formChangesSubscription = this.form.form.valueChanges.subscribe(formValue => {
      const permalinkParams = this.getPermalinkParamsFromFormValues(formValue);
      // old way
      //  this.urlHashParamsProviderService.setHashParams(permalinkParams);
      // new way
      this.stateService.legacyFormModel.set(permalinkParams);
    });

  }

  ngOnDestroy() {
    this.formChangesSubscription?.unsubscribe();
  }

  ngAfterViewChecked() {
    if (this.mapInput) {
      this.mapInput.map.invalidateSize();
    }
  }

  private getBoundaryTypeFromHashParams(hashParams: URLSearchParams): BoundaryType | undefined {
    let boundaryType: BoundaryType | undefined = undefined;
    if (hashParams.get('bboxes')) {
      boundaryType = 'bbox';
    } else if (hashParams.get('bpolys')) {
      boundaryType = 'bpoly';
    } else if (hashParams.get('adminids')) {
      boundaryType = 'admin';
    }
    return boundaryType;
  }

  get boundaryType(): BoundaryType {
    return this._boundaryType;
  }

  set boundaryType(value: BoundaryType) {
    this.mapCenter = this.mapInput.map.getCenter();
    this.zoom = this.mapInput.map.getZoom();
    this.mapOptions = {...this.mapOptions, center: this.mapInput.map.getCenter(), zoom: this.mapInput.map.getZoom()};
    this._boundaryType = value;
  }

  get selectedNames(): string[] {
    if (this.form.controls['bpolys'] && this.boundaryType === 'admin') {
      this._selectedNames = this.getSelectedPropertyValues('display_name').map(String);
      return this._selectedNames;
    }
    return [];
  }

  public getSelectedPropertyValues(propertyName: string) {
    if (!('bpolys' in this.form.controls) || !this.form.controls['bpolys'].value || this.form.controls['bpolys'].value.trim() === '') {
      return [];
    }

    const selectedPropertyvalues: GeoJsonProperties[] = [];

    try {
      const geoJson = JSON.parse(this.form.controls['bpolys'].value);
      propEach(geoJson, (properties) => {
        if (properties) {
          if (propertyName in properties) {
            selectedPropertyvalues.push(properties[propertyName]);
          }
        }
      })
    } catch {
      return [];
    }

    return selectedPropertyvalues;
  }


  getPermalinkParamsFromFormValues(formValue): Record<any, any> {
    const permalinkParams = {...formValue};

    // set osm boundary id
    // admin and bpoly will send bpolys param to backend but for admin we only want to store the ids in the permalink
    if (this.boundaryType === 'admin') {
      // delete bpolys and add adminIds
      // replace geojson with id
      if (permalinkParams.bpolys) {
        const bpolys = JSON.parse(permalinkParams.bpolys);
        if (bpolys.features && bpolys.features.length > 0) {
          permalinkParams.adminids = this.getSelectedPropertyValues('id').join(',');
        }
      }
      delete permalinkParams.bpolys;
    }

    // transform indicator checkboxes to list
    if (this.queryModeSignal() === 'oqtApi') {
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


      // transform attribute-completeness--attributes
      if (permalinkParams["attribute-completeness--attributes"]) {
        permalinkParams["attribute-completeness--attributes"] = permalinkParams["attribute-completeness--attributes"].join(',');
      }
    }


    return permalinkParams;
  }


  onSubmit() {
    console.log('Form Value', this.form.value);
    const permalinkParams = this.getPermalinkParamsFromFormValues(this.form.value);
    console.log("ONSUBMIT QueryPanel permalinkparams", permalinkParams);
    this.dataService.pushFormValues(this.form.value, this._boundaryType);
  }

  removeAdminBoundary(event: MouseEvent) {
    const featureIndex = event.currentTarget?.['dataset']['featureIndex'];
    const featureCollection = JSON.parse(this.adminBoundaries());
    featureCollection.features.splice(featureIndex, 1);
    if (featureCollection.features.length === 0) {
      this.adminBoundaries.set('');
    } else {
      this.adminBoundaries.set(JSON.stringify(featureCollection));
    }

  }

  onRemoveAllBoundaries(): void {
    if (this.mapInput && 'removeAllBoundaries' in this.mapInput) {
      this.mapInput.removeAllBoundaries();
    }

    if (this.boundaryType === 'admin') {
      this.adminBoundaries.set('');
    }

    this.form.controls['bboxes']?.setValue('');
    this.form.controls['bcircles']?.setValue('');
    this.form.controls['bpolys']?.setValue('');
  }

  protected readonly window = window;
  protected readonly Object = Object;
  protected readonly JSON = JSON;
  // protected readonly $localize = $localize;
}
