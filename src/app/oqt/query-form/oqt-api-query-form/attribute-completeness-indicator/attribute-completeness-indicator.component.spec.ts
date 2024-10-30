import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeCompletenessIndicatorComponent } from './attribute-completeness-indicator.component';

describe('AttributeCompletenessIndicatorComponent', () => {
  let component: AttributeCompletenessIndicatorComponent;
  let fixture: ComponentFixture<AttributeCompletenessIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeCompletenessIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttributeCompletenessIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
