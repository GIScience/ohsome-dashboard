import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ResultPanelComponent} from './result-panel.component';
import {ResultListDirective} from './result-list.directive';
import {DataService} from '../singelton-services/data.service';

describe('ResultPanelComponent', () => {
  let component: ResultPanelComponent;
  let fixture: ComponentFixture<ResultPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultPanelComponent, ResultListDirective ],
      providers:[DataService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
