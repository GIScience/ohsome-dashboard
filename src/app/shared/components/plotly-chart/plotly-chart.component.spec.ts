import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyChartComponent } from './plotly-chart.component';

describe('PlotlyChartComponent', () => {
  let component: PlotlyChartComponent;
  let fixture: ComponentFixture<PlotlyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlotlyChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlotlyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
