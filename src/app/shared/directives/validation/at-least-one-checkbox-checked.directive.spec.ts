import {AtLeastOneCheckboxCheckedDirective} from './at-least-one-checkbox-checked.directive';
import {describe, expect, it} from "vitest";

describe('AtLeastOneCheckboxCheckedDirective', () => {
  it('should create an instance', () => {
    const directive = new AtLeastOneCheckboxCheckedDirective();
    expect(directive).toBeTruthy();
  });
});
