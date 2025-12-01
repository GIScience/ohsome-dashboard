import {Component, ViewChild} from '@angular/core';
import {ResultListDirective} from './result-list.directive';

@Component({
    selector: 'app-result-panel',
    templateUrl: './result-panel.component.html',
    styleUrls: ['./result-panel.component.css'],
    imports: [ResultListDirective]
})
export class ResultPanelComponent {

  @ViewChild(ResultListDirective, { static: true })
  resultList: ResultListDirective;

  get numResults() {
    return this.resultList.length;
  }

}
