import {ComponentRef, Directive, inject, OnInit, ViewContainerRef} from '@angular/core';
import {ResultComponent} from '../ohsomeapi/result/result.component';
import {DataService} from '../singelton-services/data.service';
import {OqtResultComponent} from '../02_quality/result/oqt-result.component';
import {ExtractionResultComponent} from '../03_extraction/result/extraction-result.component';
import {StateService} from '../singelton-services/state.service';
import bbox from '@turf/bbox';
import {flatCoordsToPolygon, parseBoundaryLists} from '../shared/utils/boundaries.utils';
import bboxPolygon from '@turf/bbox-polygon';
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
      this.resultItem.instance.formValues = result.formValues;
      this.resultItem.instance.boundaryType = result.boundaryType;
      this.resultItem.instance.componentRef = this.resultItem;
    }

    private createOqtComponent(result) {
      const oqtResultItem = this.container.createComponent(OqtResultComponent, {index: 0});
      oqtResultItem.instance.formValues = result.formValues;
      oqtResultItem.instance.boundaryType = result.boundaryType;
      oqtResultItem.instance.componentRef = oqtResultItem;
    }

    private createExtractionComponent(result) {

      // transform boundary to bbox for aoi
      switch (result.boundaryType) {
        case 'admin':
          const fc = JSON.parse(result.formValues.bpolys);
          console.log('featureCollection', fc);
          result.formValues.aoi = bbox(fc).join(',');
          break;
        case 'bbox':
          const bboxValueIds = parseBoundaryLists(result.formValues.bboxes);
          // @ts-ignore
          result.formValues.aoi = bbox(featureCollection(bboxValueIds.values.map(bboxPolygon))).join(',');
          break;
        case 'bpoly':
          const bpolyValueIds = parseBoundaryLists(result.formValues.bpolys);
          // @ts-ignore
          result.formValues.aoi = bbox(featureCollection(bpolyValueIds.values.map(flatCoordsToPolygon))).join(',');
          break;
        default:
          console.log("create extraction result, boundary type conversion not implemented", result.boundaryType);
      }

      const extractionResultItem = this.container.createComponent(ExtractionResultComponent, {index: 0});
      extractionResultItem.setInput('formValues', result.formValues);
      extractionResultItem.instance.componentRef = extractionResultItem;
    }

  }
