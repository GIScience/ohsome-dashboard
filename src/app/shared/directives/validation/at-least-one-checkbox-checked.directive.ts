import {Directive} from '@angular/core';
import {FormGroup, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
    selector: '[appAtLeastOneOqtIndicatorCheckboxChecked]',
    providers: [{ provide: NG_VALIDATORS, useExisting: AtLeastOneCheckboxCheckedDirective, multi: true }],
    standalone: false
})
export class AtLeastOneCheckboxCheckedDirective implements Validator {

  validate(control: FormGroup): ValidationErrors | null {

    //use the checkbox names in the indicatorGroup to query if checkbox formcontrols are selected (value = true)

    const checkedCheckboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('#indicatorGroup input[type=checkbox]');
    const names: string[] = [];
    checkedCheckboxes.forEach(value => {
      if(value?.dataset?.['indicatorKey'] ){
        names.push(value.dataset['indicatorKey'])
      }
    });

    const controls = control.controls;

    const isValid = names.reduce((previousValue, currentValue) => previousValue || !!controls[currentValue]?.value, false);

    return ((control.get('backend')?.value === 'ohsomeApi') || isValid) ? null : {
      type: 'ValidationError',
      message: 'At least one checkbox must be checked!'
    };
  }

}
