import {AfterViewInit, Component, ElementRef, forwardRef, Input, NgZone, signal, ViewChild} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import {KeyValue, NgForOf} from '@angular/common';
import {OqtAttribute} from '../../../oqt/types/types';


declare const $;

@Component({
  selector: 'app-sui-multi-select-search-dropdown',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './sui-multi-select-search-dropdown.component.html',
  styleUrl: './sui-multi-select-search-dropdown.component.css',
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

  @ViewChild("dropdown", {static: false}) dropdown: ElementRef;
  // see https://semantic-ui.com/modules/dropdown.html#/settings for properties that you can set in options
  @Input() options: object = {};
  @Input() selectOptions!: Array<KeyValue<string, OqtAttribute>>;
  required = signal(false);

  constructor(private ngZone: NgZone) {
  }

  // selectedAttributeKeys
  value: string[];

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

    const options: object = Object.assign({
      onChange: (value: string[]) => {
        if (value != undefined) {
          this.onChange(value);
        }
      }
    }, this.options);

    this.ngZone.runOutsideAngular(() => {
      $(this.dropdown.nativeElement)
        .dropdown(options);
    })

  }

  updateDropdown(value: string[]) {
    this.ngZone.runOutsideAngular(() => {
      $(this.dropdown.nativeElement).dropdown('clear');
      setTimeout(() => {
        // $(this.dropdown.nativeElement).dropdown('clear');
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
