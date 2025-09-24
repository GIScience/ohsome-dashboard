import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Checkbox, Indicator} from '../../../types/types';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: 'app-simple-indicator',
    templateUrl: './simple-indicator.component.html',
    styleUrl: './simple-indicator.component.css',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    standalone: false
})
export class SimpleIndicatorComponent {
  @Input() indicator!: Checkbox<Indicator>;
  @Input() qualityDimension!: string;
  @Output() indicatorToggle: EventEmitter<{indicator: Indicator, state: boolean}> = new EventEmitter<{indicator: Indicator, state: boolean}>();
  @Input() ohsomedb: boolean = false;
  }
