import {
  Component,
  effect,
  inject,
  Input,
  OnInit,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { categoryRegistry, thematicCategoryType } from './thematic-accuracy-indicator.constants';
import { SuiMultiSelectSearchDropdownComponent } from '../../../../shared/components/sui-dropdown/sui-multi-select-search-dropdown.component';
import {KeyValuePipe} from '@angular/common';
import {StateService} from '../../../../singelton-services/state.service';
import {QualityFormData} from '../../../../03_extraction/query-form/types';


@Component({
    selector: 'app-thematic-accuracy-indicator',
    templateUrl: './thematic-accuracy-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    SuiMultiSelectSearchDropdownComponent,
    KeyValuePipe,
  ],
})
export class ThematicAccuracyIndicatorComponent implements OnInit {
  private stateService = inject(StateService);

  @Input({required: true}) indicatorKey!: string;
  @Input() selectOptions!: { label: string; value: number }[];
  @Input() hashParams!: URLSearchParams;

  selectedCategoryIds = signal<string>('');

  categories: Record<
    string,
    never
  >;

  categoryType: string;

  thematicDropdownOptions: object;

  constructor() {
    // keep the quality form model in sync so the selected category is included on submit
    effect(() => {
      const value = this.selectedCategoryIds();
      if (!this.categoryType) {
        return;
      }
      const key = `${this.indicatorKey}--${this.categoryType}`;
      this.stateService.qualityFormModel.update((old) => ({...old, [key]: value}) as QualityFormData);
    });
  }

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
    this.selectedCategoryIds.set(this.getThematicCategoryFromUrlHashParams(this.hashParams));
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
