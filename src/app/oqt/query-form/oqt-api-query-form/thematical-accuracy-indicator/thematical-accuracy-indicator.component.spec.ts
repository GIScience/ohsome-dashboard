import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThematicalAccuracyIndicatorComponent } from './thematical-accuracy-indicator.component';

describe('ThematicalAccuracyIndicatorComponent', () => {
  let component: ThematicalAccuracyIndicatorComponent;
  let fixture: ComponentFixture<ThematicalAccuracyIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThematicalAccuracyIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThematicalAccuracyIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
