import {Component, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {ResultListDirective} from './result-list.directive';

@Component({
    selector: 'app-result-panel',
    templateUrl: './result-panel.component.html',
    styleUrls: ['./result-panel.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ResultListDirective]
})
export class ResultPanelComponent {

  @ViewChild(ResultListDirective, { static: true })
  resultList: ResultListDirective;

  get numResults() {
    return this.resultList.length;
  }

}
