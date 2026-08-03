import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  NgZone,
  ViewChild
} from '@angular/core';


import Utils from '../../../../utils';
import {FormValueControl} from '@angular/forms/signals';
import {KeyValue} from '@angular/common';

declare const $: any;

type DropdownValue = string | string[];

@Component({
  selector: 'app-sui-multi-select-search-dropdown',
  templateUrl: './sui-multi-select-search-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuiMultiSelectSearchDropdownComponent
  implements FormValueControl<DropdownValue> {

  private readonly ngZone = inject(NgZone);

  @ViewChild('dropdown')
  dropdown!: ElementRef;

  value = model<DropdownValue>('');

  disabled = input(false);

  options = input<object>({});
  selectOptions = input<Array<KeyValue<string, {
    name: string;
    selected?: boolean;
  }>>>([]);

  multiple = input(false);
  searchable = input(true);

  required = input(false);

  private suppressChange = false;
  private initialized = false;


  constructor() {
    afterRenderEffect(() => {

      // ViewChild is available here
      if (!this.initialized && this.dropdown) {
        this.initDropdown();
        this.initialized = true;

        this.updateDropdown(this.value());
      }

    });


    // synchronize form -> widget
    effect(() => {
      const value = this.value()

      if (!this.initialized) {
        return;
      }
      console.log('effect', value);
      this.updateDropdown(value);

    });
  }


  private initDropdown(): void {

    const options = {
      ...this.options(),

      onChange: (value: DropdownValue) => {

        if (this.suppressChange) {
          return;
        }

        const empty =
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);


        if (empty) {
          this.value.set(this.multiple() ? [] : '');
          return;
        }


        if (this.multiple()) {

          const oldValue = this.value();

          const oldArray = Array.isArray(oldValue)
            ? oldValue
            : [];

          const newArray = value as string[];

          if (!Utils.arraysEqualUnordered(oldArray, newArray)) {
            this.value.set(newArray);
          }

        } else {

          const newValue = value as string;

          if (newValue !== this.value()) {
            this.value.set(newValue);
          }

        }
      }
    };


    this.ngZone.runOutsideAngular(() => {
      $(this.dropdown.nativeElement)
        .dropdown(options);
    });
  }


  private updateDropdown(value: DropdownValue): void {

    this.ngZone.runOutsideAngular(() => {

      this.suppressChange = true;

      // $(this.dropdown.nativeElement)
      //   .dropdown('clear');


      if (value !== undefined && value !== null) {
        // queueMicrotask(() => {
          $(this.dropdown.nativeElement)
            .dropdown('set exactly', value);
        // });
      }

      this.suppressChange = false;

    });
  }

  // TODO not needed anymore?
  // validate() {
  //   const value = this.value();
  //
  //   const empty =
  //     value === '' ||
  //     value == null ||
  //     (Array.isArray(value) && value.length === 0);
  //
  //   return this.required() && empty
  //     ? {required: true}
  //     : null;
  // }
}
