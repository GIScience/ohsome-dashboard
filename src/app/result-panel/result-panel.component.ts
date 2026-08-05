import {ChangeDetectionStrategy, Component, viewChild} from '@angular/core';
import {ResultListDirective} from './result-list.directive';

@Component({
  selector: 'app-result-panel',
  templateUrl: './result-panel.component.html',
  styleUrls: ['./result-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResultListDirective]
})
export class ResultPanelComponent {

  resultList = viewChild.required(ResultListDirective);

}
