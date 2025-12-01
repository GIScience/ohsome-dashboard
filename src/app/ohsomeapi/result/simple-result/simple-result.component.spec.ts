import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SimpleResultComponent} from './simple-result.component';
import {SimpleChartComponent} from '../simple-chart/simple-chart.component';
import {ResultComponent} from '../result.component';
import {simpleResultMockInputs} from './simple-result.mockdata';

describe('SimpleResultComponent', () => {
  let component: SimpleResultComponent;
  let fixture: ComponentFixture<SimpleResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [SimpleResultComponent, SimpleChartComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleResultComponent);
    component = fixture.componentInstance;
    component.unit = simpleResultMockInputs.unit;
    component.chartJsData = ResultComponent.prototype.createChartJsData(simpleResultMockInputs.ohsomeApiSimpleResult);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
