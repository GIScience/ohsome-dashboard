import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismEditorComponent } from './prism-editor.component';

describe('PrismEditorComponent', () => {
  let component: PrismEditorComponent;
  let fixture: ComponentFixture<PrismEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrismEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrismEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
