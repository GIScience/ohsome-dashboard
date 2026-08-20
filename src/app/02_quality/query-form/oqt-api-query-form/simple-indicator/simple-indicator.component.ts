import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from '@angular/core';
import {Checkbox, Indicator} from '../../../types/types';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import {getLocalizedOqapiDocsUrl} from '../../../../shared/shared-types';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-simple-indicator',
    templateUrl: './simple-indicator.component.html',
    styleUrl: './simple-indicator.component.css',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgClass, FormsModule]
})
export class SimpleIndicatorComponent {
  @Input() indicator!: Checkbox<Indicator>;
  @Input() qualityDimension!: string;
  @Output() indicatorToggle: EventEmitter<{indicator: Indicator, state: boolean}> = new EventEmitter<{indicator: Indicator, state: boolean}>();

  getDescriptionWithLink(): string {
    const link_text = $localize`Click here for more info.`
    const link = getLocalizedOqapiDocsUrl(environment.oqapiDocsUrl, this.indicator.key);
    return `${this.indicator.description} <br> <a target="_blank" href="${link}">${link_text}</a>`;
  }

}
