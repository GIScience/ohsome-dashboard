import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Checkbox, Indicator} from '../../../types/types';
import {ControlContainer, FormsModule, NgForm} from '@angular/forms';
import {NgClass} from '@angular/common';

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
export class SimpleIndicatorComponent {
  @Input() indicator!: Checkbox<Indicator>;
  @Input() qualityDimension!: string;
  @Output() indicatorToggle: EventEmitter<any> = new EventEmitter<{indicator: Indicator, state: boolean}>();
}
