import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Checkbox, Indicator} from '../../../types/types';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-simple-indicator',
    templateUrl: './simple-indicator.component.html',
    styleUrl: './simple-indicator.component.css',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [NgClass, FormsModule]
})
export class SimpleIndicatorComponent {
  @Input() indicator!: Checkbox<Indicator>;
  @Input() qualityDimension!: string;
  @Output() indicatorToggle: EventEmitter<{indicator: Indicator, state: boolean}> = new EventEmitter<{indicator: Indicator, state: boolean}>();

  getDescriptionWithLink(): string {
    const locale = JSON.parse(localStorage.getItem("locale") || '"en"');
    const link_text = $localize`Click here for more info.`
    return `${this.indicator.description} <a href="https://github.com/GIScience/ohsome-quality-api/blob/main/docs/indicators_${locale}.md">${link_text}</a>`;
  }

}
