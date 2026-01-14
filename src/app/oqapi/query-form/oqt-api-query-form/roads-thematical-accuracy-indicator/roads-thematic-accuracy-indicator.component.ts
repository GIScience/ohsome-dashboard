import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { thematicAttributeMap } from './roads-thematic-accuracy-indicator.constants';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import { SuiMultiSelectSearchDropdownComponent } from '../../../../shared/components/sui-dropdown/sui-multi-select-search-dropdown.component';
import { KeyValuePipe } from '@angular/common';


@Component({
    selector: 'app-roads-thematic-accuracy-indicator',
    templateUrl: './roads-thematic-accuracy-indicator.component.html',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [
        SuiMultiSelectSearchDropdownComponent,
        FormsModule,
        KeyValuePipe,
    ],
})
export class RoadsThematicAccuracyIndicatorComponent implements OnInit {
  @Input({required: true}) indicatorKey!: string;
  @Input() selectOptions!: { label: string; value: number }[];
  @Input() hashParams!: URLSearchParams;
  selectedThematicAttributeIds: string  = "";

  thematicAttributeMap = thematicAttributeMap;


  thematicAttributeDropdownOptions = {
    fullTextSearch: 'exact',
    clearable: true,
  };

  getThematicAttributeFromUrlHashParams(hashParams: URLSearchParams): string {

    console.log("hashParams", hashParams);

    // 1. extract the attribute from URL
    const thematicAttributeFromUrl: string | null = hashParams.get('roads-thematic-accuracy--attribute');

    // 2.undefined should return an empty string
    if (thematicAttributeFromUrl == null) {
      return "";
    }
    // 3. if the attribute is not in the map, return an empty string
    if (!Object.keys(this.thematicAttributeMap).includes(thematicAttributeFromUrl)) {
      return "";
    }

    return thematicAttributeFromUrl;
  }
  ngOnInit() {
    this.selectedThematicAttributeIds = this.getThematicAttributeFromUrlHashParams(this.hashParams);

  }
}
