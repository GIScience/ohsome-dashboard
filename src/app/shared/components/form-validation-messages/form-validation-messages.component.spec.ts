import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {beforeEach, describe, expect, it} from 'vitest';

import {FormValidationMessagesComponent} from './form-validation-messages.component';

describe('FormValidationMessagesComponent', () => {
  let component: FormValidationMessagesComponent;
  let fixture: ComponentFixture<FormValidationMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormValidationMessagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormValidationMessagesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders nothing when there are no messages', () => {
    fixture.componentRef.setInput('messages', []);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.ui.left.pointing.red.basic.label'))).toBeNull();
  });

  it('renders one line per message inside the red label', () => {
    fixture.componentRef.setInput('messages', [
      'Please select an area of interest.',
      'An ohsome filter is required.',
    ]);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.ui.left.pointing.red.basic.label'))).not.toBeNull();

    const lines = fixture.debugElement
      .queryAll(By.css('.ui.left.pointing.red.basic.label div'))
      .map((debugEl) => (debugEl.nativeElement.textContent as string).trim());

    expect(lines).toEqual([
      'Please select an area of interest.',
      'An ohsome filter is required.',
    ]);
  });

  // semantic ui selects the arrow direction via [class*="left pointing"], so the assertions check the
  // rendered class string rather than a css selector, which would match regardless of the word order
  it('points the arrow to the left by default', () => {
    fixture.componentRef.setInput('messages', ['An ohsome filter is required.']);
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('div.ui.label')).nativeElement as HTMLElement;

    expect(label.getAttribute('class')).toContain('left pointing');
  });

  it('points the arrow to the right when arrowDirection is set to right', () => {
    fixture.componentRef.setInput('messages', ['An ohsome filter is required.']);
    fixture.componentRef.setInput('arrowDirection', 'right');
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('div.ui.label')).nativeElement as HTMLElement;

    expect(label.getAttribute('class')).toContain('right pointing');
    expect(label.getAttribute('class')).not.toContain('left pointing');
  });
});
