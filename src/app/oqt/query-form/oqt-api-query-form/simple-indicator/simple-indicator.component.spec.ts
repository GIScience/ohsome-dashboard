import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleIndicatorComponent } from './simple-indicator.component';

describe('SimpleIndicatorComponent', () => {
  let component: SimpleIndicatorComponent;
  let fixture: ComponentFixture<SimpleIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimpleIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
