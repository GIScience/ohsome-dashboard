import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractionResultComponent } from './extraction-result.component';

describe('ExtractionResultComponent', () => {
  let component: ExtractionResultComponent;
  let fixture: ComponentFixture<ExtractionResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtractionResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtractionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
