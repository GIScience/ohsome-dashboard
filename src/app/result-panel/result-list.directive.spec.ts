import {ResultListDirective} from './result-list.directive';
import {TestBed} from '@angular/core/testing';
import {ResultPanelComponent} from './result-panel.component';
import {DataService} from '../singelton-services/data.service';


describe('ResultListDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ResultPanelComponent
      ],
      providers:[
        DataService
      ]
    }).compileComponents();

  });
  it('should create an instance', () => {
    const fixtureResultPanelComponent = TestBed.createComponent(ResultPanelComponent);
    const comp = fixtureResultPanelComponent.nativeElement;

    const service = TestBed.inject(DataService);

    const directive = new ResultListDirective(comp,service);
    expect(directive).toBeTruthy();
  });
});
