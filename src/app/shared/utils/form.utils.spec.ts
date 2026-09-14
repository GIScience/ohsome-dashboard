import {describe, expect, it} from 'vitest';
import {getFormValidationMessages} from './form.utils';
import {ValidationError} from '@angular/forms/signals';

describe('getFormValidationMessages', () => {

  it('returns an empty array when there are no errors', () => {
    expect(getFormValidationMessages([])).toEqual([]);
  });

  it('extracts the message of each error', () => {
    const errors = [
      {kind: 'required', message: 'A value is required.'},
      {kind: 'signInRequire', message: 'You need to be signed in.'},
    ] as ValidationError.WithFieldTree[];

    expect(getFormValidationMessages(errors)).toEqual([
      'A value is required.',
      'You need to be signed in.',
    ]);
  });

  it('drops errors that carry no message', () => {
    const errors = [
      {kind: 'disabled'},
      {kind: 'custom', message: ''},
      {kind: 'custom', message: '   '},
      {kind: 'required', message: 'Please fix this.'},
    ] as ValidationError.WithFieldTree[];

    expect(getFormValidationMessages(errors)).toEqual(['Please fix this.']);
  });

  it('de-duplicates identical messages coming from different fields', () => {
    const errors = [
      {kind: 'required', message: 'At least one quality indicator must be selected.'},
      {kind: 'required', message: 'At least one quality indicator must be selected.'},
    ] as ValidationError.WithFieldTree[];

    expect(getFormValidationMessages(errors)).toEqual([
      'At least one quality indicator must be selected.',
    ]);
  });
});
