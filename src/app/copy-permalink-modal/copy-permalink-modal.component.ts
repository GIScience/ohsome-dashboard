import {Component, effect, ElementRef, inject, viewChild} from '@angular/core';
import {StateService} from '../singelton-services/state.service';
import Utils from '../../utils';

@Component({
  selector: 'app-copy-permalink-modal',
  imports: [],
  templateUrl: './copy-permalink-modal.component.html',
  styleUrl: './copy-permalink-modal.component.css',
})
export class CopyPermalinkModalComponent {
  stateService = inject(StateService);
  dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('permalinkDialog');
  permalinkInput = viewChild.required<ElementRef<HTMLInputElement>>('permalinkInput');
  copyButton = viewChild.required<ElementRef<HTMLButtonElement>>('copyButton');
  protected dialogState = this.stateService.permalinkDialog;

  constructor() {
    // state -> DOM
    effect(() => {
      const state = this.dialogState();
      const dialog = this.dialogRef().nativeElement;

      if (state.open && !dialog.open) {
        dialog.showModal();
      } else if (!state.open && dialog.open) {
        dialog.close();
      }
    });
  }

  onNativeClose(): void {
    if (this.dialogState().open) {
      this.stateService.closePermalinkDialog();
    }
  }

  protected async copyPermalink() {
    this.permalinkInput().nativeElement.select();
    try {
      await navigator.clipboard.writeText(this.permalinkInput().nativeElement.value);
      const oldButtonContent = this.copyButton().nativeElement.innerHTML;
      this.copyButton().nativeElement.innerHTML = '✓ Copied';
      await Utils.wait(800);
      this.copyButton().nativeElement.innerHTML = oldButtonContent;
    } catch (err) {
      console.error('Copy failed', err);
    }

    this.stateService.closePermalinkDialog();
  }

  protected onClickOutsideClose(event) {
    // event.preventDefault();
    console.log((event.target as HTMLElement)?.nodeName)
    if ((event.target as HTMLElement)?.nodeName === 'DIALOG') {
      this.dialogRef().nativeElement.close();
    }
  }

  protected readonly navigator = navigator;
  protected readonly window = window;
}
