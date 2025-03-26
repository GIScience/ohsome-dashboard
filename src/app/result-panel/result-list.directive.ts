import {ComponentRef, Directive, OnInit, ViewContainerRef} from '@angular/core';
import {ResultComponent} from '../oshdb/result/result.component';
import {DataService} from '../singelton-services/data.service';
import {OqtResultComponent} from '../oqt/result/oqt-result.component';

@Directive({
    selector: '[appResultList]',
    standalone: false
})
export class ResultListDirective implements OnInit {
  private resultItem: ComponentRef<ResultComponent>;

  constructor(private container: ViewContainerRef,
              private dataService: DataService) {
  }

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
}
