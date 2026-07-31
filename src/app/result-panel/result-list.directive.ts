import {ComponentRef, Directive, OnInit, ViewContainerRef, inject} from '@angular/core';
import {ResultComponent} from '../ohsomeapi/result/result.component';
import {DataService} from '../singelton-services/data.service';
import {OqtResultComponent} from '../02_quality/result/oqt-result.component';
import {ExtractionResultComponent} from '../03_extraction/result/extraction-result.component';

  @Directive({
    selector: '[appResultList]'
  })
  export class ResultListDirective implements OnInit {
    private container = inject(ViewContainerRef);
    private dataService = inject(DataService);

    private resultItem: ComponentRef<ResultComponent>;

    get length() {
      return this.container.length;
    }

    ngOnInit() {
      this.dataService.currentFormValues.subscribe(result => {
        const backend = result.formValues.backend;

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
      const extractionResultItem = this.container.createComponent(ExtractionResultComponent, {index: 0});
      extractionResultItem.setInput('formValues', result.formValues);
      extractionResultItem.instance.componentRef = extractionResultItem;
    }

  }
