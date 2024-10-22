import {AfterContentInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {Checkbox, Indicator} from '../../../types/types';
import {ControlContainer, NgForm} from '@angular/forms';

declare const $;

@Component({
  selector: 'app-simple-indicator',
  // standalone: true,
  // imports: [
  //   FormsModule,
  //   NgClass
  // ],
  templateUrl: './simple-indicator.component.html',
  styleUrl: './simple-indicator.component.css',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
})
export class SimpleIndicatorComponent implements AfterContentInit {
  @Input() indicator!: Checkbox<Indicator>;
  @Input() qualityDimension!: string;
  @Output() indicatorToggle: EventEmitter<{indicator: Indicator, state: boolean}> = new EventEmitter<{indicator: Indicator, state: boolean}>();

  ngAfterContentInit(): void {
    // directly initialize the indicator search dropdown when it is visible during component initialization
    this.initAttributeDropdown();

    // initialize the indicator search dropdown on toggle checkbox to true
    this.indicatorToggle.subscribe(
      ({indicator,state})=>{
        if (state) {
          this.initAttributeDropdown();
        }
      }
    )
  }

  private initAttributeDropdown() {
    setTimeout(() => {
      $('#search-select-attribute').dropdown({
        fullTextSearch: 'exact'
      });
      //$('.ui.dropdown2').dropdown('set exactly', this.selectedAttributeKey);

     // $('.ui.dropdown2').dropdown('set exactly', this.indicator.params[`${this.indicator.key}--attributes`]);
    }, 100);
  }

}
