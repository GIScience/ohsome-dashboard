import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { categoryRegistry, thematicCategoryType } from './thematic-accuracy-indicator.constants';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import { SuiMultiSelectSearchDropdownComponent } from '../../../../shared/components/sui-dropdown/sui-multi-select-search-dropdown.component';
import {KeyValuePipe, NgSwitch, NgSwitchCase} from '@angular/common';


@Component({
    selector: 'app-thematic-accuracy-indicator',
    templateUrl: './thematic-accuracy-indicator.component.html',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  imports: [
    SuiMultiSelectSearchDropdownComponent,
    FormsModule,
    KeyValuePipe,
    NgSwitch,
    NgSwitchCase,
  ],
})
export class ThematicAccuracyIndicatorComponent implements OnInit {
  @Input({required: true}) indicatorKey!: string;
  @Input() selectOptions!: { label: string; value: number }[];
  @Input() hashParams!: URLSearchParams;

  selectedCategoryIds: string  = "";

  categories: Record<
    string,
    never
  >;

  categoryType: string;

  thematicDropdownOptions: object;

  getThematicCategoryFromUrlHashParams(hashParams: URLSearchParams): string {

    console.log("hashParams", hashParams);

    // 1. extract the category from URL
    const thematicCategoryFromUrl: string | null = hashParams.get(this.indicatorKey + '--' + this.categoryType);

    // 2.undefined should return an empty string
    if (thematicCategoryFromUrl == null) {
      return "";
    }
    // 3. if the category is not in the map, return an empty string
    if (!Object.keys(this.categories).includes(thematicCategoryFromUrl)) {
      return "";
    }

    return thematicCategoryFromUrl;
  }
  ngOnInit() {
    this.selectedCategoryIds = this.getThematicCategoryFromUrlHashParams(this.hashParams);
    this.categories = categoryRegistry[this.indicatorKey]
    this.categoryType = thematicCategoryType[this.indicatorKey];

    this.thematicDropdownOptions = {
      fullTextSearch: 'exact',
      clearable: true,
    };
    console.log(this.indicatorKey + '--' + this.categoryType);
    console.log(this.categoryType);
  }

  protected readonly thematicCategoryType = thematicCategoryType;
}
