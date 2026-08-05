import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyPermalinkModalComponent } from './copy-permalink-modal.component';

describe('CopyPermalinkModalComponent', () => {
  let component: CopyPermalinkModalComponent;
  let fixture: ComponentFixture<CopyPermalinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyPermalinkModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyPermalinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
