import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QueryPanelComponent} from './query-panel.component';
import {OhsomeApiMetadataProviderService} from '../ohsomeapi/ohsome-api-metadata-provider.service';
import OhsomeApiMetadataProviderServiceMock from '../ohsomeapi/ohsome-api-metadata-provider.service.mock';
import {BrowserModule} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {OqtModule} from '../02_quality/oqt.module';
import {beforeEach, describe, expect, it} from 'vitest';

function fakeForm(invalidControlNames: string[] = []): NgForm {
  const controls: Record<string, { invalid: boolean }> = {};
  invalidControlNames.forEach((name) => controls[name] = {invalid: true});
  return {controls} as unknown as NgForm;
}

describe('QueryPanelComponent', () => {
  let component: QueryPanelComponent;
  let fixture: ComponentFixture<QueryPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BrowserModule,
        OqtModule, QueryPanelComponent],
    providers: [
        { provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock },
        provideHttpClient()
    ]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryPanelComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('currentValidationMessages', () => {
    it('shows the AOI message when bboxes/bpolys is invalid', () => {
      const messages = component['currentValidationMessages'](fakeForm(['bboxes']));

      expect(messages).toContain('Please select an area of interest.');
    });

    // regression test: this legacy control used to be lumped into the generic "!form.valid"
    // check, which always blamed the AOI regardless of which control was actually invalid.
    it('shows the attribute-completeness message when its legacy controls are invalid, without blaming the AOI', () => {
      const messages = component['currentValidationMessages'](fakeForm(['attribute-completeness--attributes']));

      expect(messages).toContain(
        'Select at least one attribute, or define a custom attribute filter, for the "Attribute Completeness" indicator.'
      );
      expect(messages).not.toContain('Please select an area of interest.');
    });

    it('shows the attribute-completeness message for the custom-filter controls too', () => {
      const messages = component['currentValidationMessages'](fakeForm(['attribute-completeness--attribute-title']));

      expect(messages).toContain(
        'Select at least one attribute, or define a custom attribute filter, for the "Attribute Completeness" indicator.'
      );
    });

    it('shows both messages at once when both are invalid, without duplicates', () => {
      const messages = component['currentValidationMessages'](fakeForm([
        'bboxes', 'attribute-completeness--attribute-filter',
      ]));

      expect(messages).toContain('Please select an area of interest.');
      expect(messages).toContain(
        'Select at least one attribute, or define a custom attribute filter, for the "Attribute Completeness" indicator.'
      );
      expect(messages.filter((m) => m === 'Please select an area of interest.').length).toBe(1);
    });

    it('adds no legacy-form messages when nothing is invalid', () => {
      const messages = component['currentValidationMessages'](fakeForm([]));

      expect(messages).not.toContain('Please select an area of interest.');
      expect(messages).not.toContain(
        'Select at least one attribute, or define a custom attribute filter, for the "Attribute Completeness" indicator.'
      );
    });
  });
});
