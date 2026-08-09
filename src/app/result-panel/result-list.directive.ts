import {ComponentRef, Directive, inject, OnInit, ViewContainerRef} from '@angular/core';
import {ResultComponent} from '../01_stats/result/result.component';
import {DataService} from '../singelton-services/data.service';
import {OqtResultComponent} from '../02_quality/result/oqt-result.component';
import {ExtractionResultComponent} from '../03_extraction/result/extraction-result.component';
import {StateService} from '../singelton-services/state.service';
import bbox from '@turf/bbox';
import {toPolygonFeatures, unionFeatureDisplayNames} from '../shared/utils/boundaries.utils';
import envelope from '@turf/envelope';
import {featureCollection} from '@turf/helpers';

@Directive({
  selector: '[appResultList]'
})
export class ResultListDirective implements OnInit {
  private container = inject(ViewContainerRef);
  private stateService = inject(StateService);
  private dataService = inject(DataService);

  private resultItem: ComponentRef<ResultComponent>;

  get length() {
    return this.container.length;
  }

  ngOnInit() {
    this.dataService.currentFormValues.subscribe(result => {
      const backend = this.stateService.queryModeSignal();
      switch (backend) {
        case 'ohsomeApi':
          this.createResultComponent(result);
          break;
        case 'oqtApi':
          this.createOqtComponent(result);
          break;
        default:
          console.log("create extraction result", result);
          this.createExtractionComponent(result);
      }

    });
  }

  createResultComponent(result) {
    this.resultItem = this.container.createComponent(ResultComponent, {index: 0});
    this.resultItem.setInput('formValues', {...result.formValues, ...this.stateService.statsFormModel()});
    this.resultItem.instance.boundaryType = result.boundaryType;
    this.resultItem.instance.componentRef = this.resultItem;
  }

  private createOqtComponent(result) {
    const oqtResultItem = this.container.createComponent(OqtResultComponent, {index: 0});
    oqtResultItem.setInput('formValues', result.formValues);
    oqtResultItem.instance.boundaryType = result.boundaryType;
    oqtResultItem.instance.componentRef = oqtResultItem;

  }

  private createExtractionComponent(result) {

    // const unifiedFeature = unionPolygonFeatures(toPolygonFeatures(result.formValues));
    const polygonFeatures = toPolygonFeatures(result.formValues);
    const envelopeFeature = envelope(featureCollection(polygonFeatures));
    result.formValues.aoi = bbox(envelopeFeature);
    result.formValues.displayName = unionFeatureDisplayNames(polygonFeatures);

    const extractionResultItem = this.container.createComponent(ExtractionResultComponent, {index: 0});
    extractionResultItem.setInput('formValues', result.formValues);
    extractionResultItem.instance.componentRef = extractionResultItem;
  }

}
