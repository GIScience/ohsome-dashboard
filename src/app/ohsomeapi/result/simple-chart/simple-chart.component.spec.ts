import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleChartComponent} from './simple-chart.component';
import {beforeEach, describe, expect, it} from 'vitest';

describe('SimpleChartComponent', () => {
  let component: SimpleChartComponent;
  let fixture: ComponentFixture<SimpleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleChartComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleChartComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
