import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from '@angular/core';
import {Checkbox, Indicator} from '../../../types/types';
import { NgClass } from '@angular/common';
import {getLocalizedOqapiDocsUrl} from '../../../../shared/shared-types';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-simple-indicator',
    templateUrl: './simple-indicator.component.html',
    styleUrl: './simple-indicator.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgClass]
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
