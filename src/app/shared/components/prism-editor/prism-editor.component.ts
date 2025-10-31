import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {basicEditor, SetupOptions,} from 'prism-code-editor/setups';
import {languages} from 'prism-code-editor/prism';
import {PRISM_LANGUAGE_OHSOME_FILTER} from '../../../../prism-language-ohsome-filter';

@Component({
  selector: 'app-prism-editor',
  imports: [],
  templateUrl: './prism-editor.component.html'
})

export class PrismEditorComponent implements OnInit, OnChanges {
  @Input() value: string;
  @Input() readonly: boolean = false;
  @Input() partialSetupOptions: Omit<Partial<SetupOptions>, 'value' | 'readOnly' | 'onUpdate'>;
  @Input() backgroundColor?: string;

  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('prismEditorElement', {static: true}) prismEditorElement: ElementRef<HTMLDivElement>;
  editor;

  ngOnInit(): void {
    // default options for prism editor with ohsome-filter language
    languages['ohsome-filter'] = PRISM_LANGUAGE_OHSOME_FILTER;

    const setupOptions: SetupOptions = {
      theme: 'prism',
      language: 'ohsome-filter',
      ...this.partialSetupOptions,
      value: this.value,
      onUpdate: (value) => {
        this.valueChange.emit(value);
      }
    };

    if (this.readonly) {
      // readonly does not need event handler
      delete setupOptions.onUpdate;
      setupOptions.readOnly = true;
    }

    this.editor = basicEditor(this.prismEditorElement.nativeElement, setupOptions);

    if(this.backgroundColor){
      this.editor.scrollContainer.style.setProperty("--editor__bg", this.backgroundColor);
      this.editor.scrollContainer.style.setProperty("--editor__bg-highlight", this.backgroundColor);
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !changes['value'].firstChange) {
      this.editor.setOptions({value: changes['value'].currentValue});
    }
  }

}
