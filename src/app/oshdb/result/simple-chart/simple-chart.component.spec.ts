import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {SimpleChartComponent} from './simple-chart.component';

describe('SimpleChartComponent', () => {
  let component: SimpleChartComponent;
  let fixture: ComponentFixture<SimpleChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleChartComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
