import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {basicEditor} from 'prism-code-editor/setups';
import {languages} from 'prism-code-editor/prism';
import {PRISM_LANGUAGE_OHSOME_FILTER} from '../../../../prism-language-ohsome-filter';

@Component({
  selector: 'app-prism-editor',
  standalone: true,
  imports: [],
  templateUrl: './prism-editor.component.html',
  styleUrl: './prism-editor.component.css'
})
export class PrismEditorComponent implements OnInit, OnChanges {
@Input() value: string;
editor;

  ngOnInit(): void {
    languages['ohsome-filter'] = PRISM_LANGUAGE_OHSOME_FILTER;
    this.editor = basicEditor(
      '#prism-editor',
      {
        language:'ohsome-filter',
        theme: 'prism',
      },
      ()=> console.log('PRISM READY', this.editor),
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('CHANGES PRISM', changes);
    if (changes['value'] && !changes['value'].isFirstChange()) {}
    this.editor.setOptions({value: changes['value'].currentValue});
  }

}