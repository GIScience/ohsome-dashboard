import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SimpleGroupbyResultComponent} from './simple-groupby-result.component';
import {SimpleChartComponent} from '../simple-chart/simple-chart.component';
import {simpleGroupbyResultMockInputs} from './simple-groupby-result.mockdata';
import {OhsomeApi} from '@giscience/ohsome-js-utils';
import GroupByResponse = OhsomeApi.v1.response.GroupByResponse;

describe('SimpleGroupbyResultComponent', () => {
  let component: SimpleGroupbyResultComponent;
  let fixture: ComponentFixture<SimpleGroupbyResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [SimpleGroupbyResultComponent, SimpleChartComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGroupbyResultComponent);
    component = fixture.componentInstance;
    component.formValues = simpleGroupbyResultMockInputs.formValuesMock;
    component.response = new GroupByResponse(simpleGroupbyResultMockInputs.ohsomeApiSimpleGroupByResult);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
