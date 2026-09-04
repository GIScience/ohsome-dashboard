import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-form-validation-messages',
  templateUrl: './form-validation-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormValidationMessagesComponent {
  messages = input<string[]>([]);
}
