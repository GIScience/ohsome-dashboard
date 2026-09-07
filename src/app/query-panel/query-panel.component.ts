import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  ViewChild
} from '@angular/core';
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
import {BoundaryInputComponentOptions, BoundaryType, isQueryMode, QueryMode, Userlayer} from '../shared/shared-types';
import {UrlHashParamsProviderService} from '../singelton-services/url-hash-params-provider.service';
import {OqtApiMetadataProviderService} from '../02_quality/oqt-api-metadata-provider.service';
import {OsmBoundaryProviderService} from '../singelton-services/osm-boundary-provider.service';
import bboxPolygon from '@turf/bbox-polygon';
import {NgClass} from '@angular/common';
import {OqtApiQueryFormComponent} from '../02_quality/query-form/oqt-api-query-form/oqt-api-query-form.component';
import {AuthService} from "../singelton-services/auth.service";
import {StateService} from '../singelton-services/state.service';
import {StatsQueryFormComponent} from '../01_stats/query-form/stats-query-form.component';
import {ExtractionQueryFormComponent} from '../03_extraction/query-form/extraction-query-form.component';
import {
  FormValidationMessagesComponent
} from '../shared/components/form-validation-messages/form-validation-messages.component';

@Component({
  selector: 'app-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, OqtApiQueryFormComponent, BoundarySelectInputComponent, BoundaryInputComponent, StatsQueryFormComponent, ExtractionQueryFormComponent, FormValidationMessagesComponent]
})
export class QueryPanelComponent implements AfterViewChecked {
  private dataService = inject(DataService);
  protected authService = inject(AuthService);
  ohsomeApiMetadataProviderService = inject(OhsomeApiMetadataProviderService);
  oqtApiMetadataProviderService = inject(OqtApiMetadataProviderService);
  protected urlHashParamsProviderService = inject(UrlHashParamsProviderService);
  protected stateService = inject(StateService);
  private osmBoundaryProviderService = inject(OsmBoundaryProviderService);


  @ViewChild('bsi', {static: false})
  mapInput: BoundarySelectInputComponent | BoundaryInputComponent;

  // settings from hash
  queryModeSignal = computed<QueryMode>((): QueryMode => {
    const backendParam = this.stateService.appState().queryMode ?? 'ohsomeApi';
    return isQueryMode(backendParam) ? backendParam : 'ohsomeApi';
  });

  isValidCurrentForm = this.stateService.isValidCurrentForm;

  public readonly initialHashParams: URLSearchParams;

  // default map settings
  public maskPoly;
  public zoom = environment.mapOptions.zoom;
  public minZoom = 0;
  public maxBounds: LatLngBoundsExpression = [[-90, -180], [90, 180]];
  public mapCenter = environment.mapOptions.center;
  public bcircles = '';
  protected bboxes = this.stateService.sharedFormSignals.bboxes;
  protected bpolys = this.stateService.sharedFormSignals.bpolys;
  protected boundaryType = this.stateService.boundaryType;
  public userDefinedPolygonLayers: Userlayer[] = [];

  public mapOptions: BoundaryInputComponentOptions;

  private _selectedNames: string[] = [];

  constructor() {
    const spatialExtent = environment.mapOptions.maskPoly ?? bboxPolygon([-180, -90, 180, 90]).geometry;
    this.maskPoly = spatialExtent;


    // Code is not necessary for global dataset
    if (environment.mapOptions.mapCenterFromPoly && typeof this.maskPoly === 'object') {
      const _envelope: Feature<Polygon> = envelope(this.maskPoly);
      const _center = centroid(_envelope);
      const _coord = getCoord(_center);
      this.mapCenter = {lat: _coord[1], lng: _coord[0]};
    }

    //precedence: hashParams over environment over default

    // settings from URL hashparams
    this.initialHashParams = this.stateService.initialHashParams;
    console.log("QP constructor hashParams: " + this.initialHashParams);

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
          this.bpolys.set(featureCollectionOrEmpty);
          // immediately trigger the query if there are hashparams
          if (this.stateService.appState().firstForm) {
            this.stateService.updatePartialState({firstForm: false});
            setTimeout(() => {
              console.log("FORM VALID", this.isValidCurrentForm());
              if (this.isValidCurrentForm()) {
                this.onSubmit();
              }
            }, 1000);
          }
        }
      });

    // keep the permalink-friendly params in sync with whichever tab's form is active
    effect(() => {
      const permalinkParams = this.getPermalinkParamsFromFormValues(this.getActiveFormValue());
      this.stateService.legacyFormModel.set(permalinkParams);
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

  private getActiveFormValue(): Record<string, any> {
    switch (this.queryModeSignal()) {
      case 'ohsomeApi':
        return this.stateService.statsFormModel();
      case 'extraction':
        return this.stateService.extractionFormModel();
      case 'oqtApi':
        return this.stateService.qualityFormModel();
    }
  }

  ngAfterViewChecked() {
    if (this.mapInput) {
      this.mapInput.map.invalidateSize();
    }
  }

  protected setBoundaryType(value: BoundaryType): void {
    const previousType = this.boundaryType();
    this.mapCenter = this.mapInput.map.getCenter();
    this.zoom = this.mapInput.map.getZoom();
    this.mapOptions = {...this.mapOptions, center: this.mapInput.map.getCenter(), zoom: this.mapInput.map.getZoom()};
    // bboxes/bpolys are both always-present fields on the form model now (unlike the old NgForm,
    // where only the active boundary type's control ever existed) - clear the one that's no longer
    // active so a stale value can't outrank the newly drawn one when building the request's AOI
    // (toPolygonFeatures() in boundaries.utils.ts always prefers bboxes over bpolys when both are set).
    // 'bpoly' and 'admin' both write to bpolys but in incompatible formats (raw bpoly DSL vs GeoJSON
    // FeatureCollection), so switching between them must also clear it - otherwise the leftover value
    // fails to parse as the new tab's format (e.g. getPermalinkParamsFromFormValues() JSON.parsing a
    // stale bpoly-DSL string throws, which silently breaks that change-detection pass and makes the
    // tab switch itself only visibly complete on the next click).
    if (value === 'bbox') {
      this.bpolys.set('');
    } else {
      this.bboxes.set('');
      if (previousType !== value) {
        this.bpolys.set('');
      }
    }
    this.stateService.boundaryType.set(value);
  }

  get selectedNames(): string[] {
    if (this.boundaryType() === 'admin') {
      this._selectedNames = this.getSelectedPropertyValues('display_name').map(String);
      return this._selectedNames;
    }
    return [];
  }

  public getSelectedPropertyValues(propertyName: string) {
    const bpolys = this.bpolys();
    if (!bpolys || bpolys.trim() === '') {
      return [];
    }

    const selectedPropertyvalues: GeoJsonProperties[] = [];

    try {
      const geoJson = JSON.parse(bpolys);
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
    if (this.boundaryType() === 'admin') {
      // replace geojson with id
      if (permalinkParams.bpolys) {
        const bpolys = JSON.parse(permalinkParams.bpolys);
        if (bpolys.features && bpolys.features.length > 0) {
          permalinkParams.adminids = this.getSelectedPropertyValues('id').join(',');
        }
      }
      permalinkParams.bpolys = undefined;
    }

    // indicators/attribute-completeness--attributes are arrays on the form model; URL hash params need comma-joined strings
    if (this.queryModeSignal() === 'oqtApi') {
      permalinkParams.indicators = (formValue.indicators ?? []).join(',');

      if (permalinkParams["attribute-completeness--attributes"]) {
        permalinkParams["attribute-completeness--attributes"] = permalinkParams["attribute-completeness--attributes"].join(',');
      }
    }


    return permalinkParams;
  }


  onSubmit(event?: Event) {
    event?.preventDefault();
    const formValue = {...this.getActiveFormValue()};
    this.dataService.pushFormValues(formValue, this.boundaryType());
  }

  removeAdminBoundary(event: MouseEvent) {
    const featureIndex = event.currentTarget?.['dataset']['featureIndex'];
    const featureCollection = JSON.parse(this.bpolys());
    featureCollection.features.splice(featureIndex, 1);
    this.bpolys.set(featureCollection.features.length === 0 ? '' : JSON.stringify(featureCollection));
  }

  onRemoveAllBoundaries(): void {
    if (this.mapInput && 'removeAllBoundaries' in this.mapInput) {
      this.mapInput.removeAllBoundaries();
    }

    this.bboxes.set('');
    this.bpolys.set('');
  }

  protected readonly window = window;
  protected readonly Object = Object;
  protected readonly JSON = JSON;
  // protected readonly $localize = $localize;
}
