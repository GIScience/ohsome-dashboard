import { AfterViewInit, Component, ElementRef, forwardRef, Input, NgZone, signal, ViewChild, inject } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import {KeyValue} from '@angular/common';
import Utils from '../../../../utils';


declare const $;

@Component({
  selector: 'app-sui-multi-select-search-dropdown',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './sui-multi-select-search-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SuiMultiSelectSearchDropdownComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SuiMultiSelectSearchDropdownComponent),
      multi: true
    }
  ]
})
export class SuiMultiSelectSearchDropdownComponent implements ControlValueAccessor, AfterViewInit {
  private readonly ngZone = inject(NgZone);


  @ViewChild("dropdown", {static: false}) dropdown: ElementRef;
  // see https://semantic-ui.com/modules/dropdown.html#/settings for properties that you can set in options
  @Input() options: object = {};
  @Input() selectOptions!: Array<KeyValue<string, {name:string, selected?:boolean}>>;
  @Input() multiple: boolean = false;
  @Input() searchable: boolean = true;
  required = signal(false);
  private suppressChange: boolean = false;

  // selectedAttributeKeys
  // depending on single or multi select mode value is sting or string[]
  value: string |string[];

  // initial state
  touched = false;

  disabled = false;

  // CVA handler
  onChange = (value: typeof this.value) => {
    console.log("ONCHANGE", value);
  };

  onTouched = () => {
  };


  // CVA methods

  // notify the parent, when the user changes the value
  registerOnChange(onChange: (value: typeof this.value) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  // form writes value to this component
  writeValue(value: string[]): void {
    this.value = value;
    this.updateDropdown(value);
  }

  // TODO implement this onBlur
  // markAsTouched() {
  //   if (!this.touched) {
  //     this.onTouched();
  //     this.touched = true;
  //   }
  // }

  ngAfterViewInit(): void {
    this.initDropdown();
  }


  initDropdown(): void {
    const options: object = {...this.options,...{
        onChange: (value:string | string[]) => {
          // avoid firing useless change events:
          // - on clearing the dropdown list
          // - values did not change
          // - in single selection mode: empty field not allows
          let shouldFire = !this.suppressChange  && value != undefined;
          if (this.multiple){
            value = value as string[];
            this.value = this.value as string[];
            shouldFire = shouldFire && !Utils.arraysEqualUnordered(this.value, value);
          } else {
            value = value as string;
            shouldFire = shouldFire && value.trim() !== '' && this.value != value;
          }

          if (shouldFire) {
            this.value = value;
            this.onChange(value);
          }
        }
      }};

    this.ngZone.runOutsideAngular(() => {
      $(this.dropdown.nativeElement)
        .dropdown(options);
    })

  }

  updateDropdown(value: string[]) {

    this.ngZone.runOutsideAngular(() => {
      this.suppressChange = true;
      $(this.dropdown.nativeElement).dropdown('clear');
      this.suppressChange = false;
      setTimeout(() => {
        $(this.dropdown.nativeElement).dropdown('set exactly', value);
      })
    })
  }

  // Validator implementation, so you can set "required" attribute on the HTMLElement
  validate(): ValidationErrors | null {
    if (this.required() && !this.value) {
      return {required: true};
    }
    return null;
  }

}
