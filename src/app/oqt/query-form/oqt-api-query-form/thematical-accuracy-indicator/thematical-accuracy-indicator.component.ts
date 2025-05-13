import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';


@Component({
  selector: 'app-thematical-accuracy-indicator',
  templateUrl: './thematical-accuracy-indicator.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],

  standalone: false,
})
export class ThematicalAccuracyIndicatorComponent implements OnInit {
  @Input({required: true}) indicatorKey!: string;
  @Input() selectOptions!: { label: string; value: number }[];
  @Input() hashParams!: URLSearchParams;
  selectedCorineClassIds: string  = "";

  corineClassMapLevel1 = {
    "1": {name: "Artificial surfaces"},
    "2": {name: "Agricultural areas"},
    "3": {name: "Forest and semi-natural areas"},
    "4": {name: "Wetlands"},
    "5": {name: "Water bodies"},
  }

  corineClassMapLevel2 = {
    "11": {name: "Urban fabric", class: 1},
    "12": {name: "Industrial, commercial and transport units", class: 1},
    "13": {name: "Mine, dump and construction sites", class: 1},
    "14": {name: "Artificial non-agricultural vegetated areas", class: 1},
    "21": {name: "Arable land", class: 2},
    "22": {name: "Permanent crops", class: 2},
    "23": {name: "Pastures", class: 2},
    "24": {name: "Heterogeneous agricultural areas", class: 2},
    "31": {name: "Forest", class: 3},
    "32": {name: "Shrubs and/or herbaceous vegetation associations", class: 3},
    "33": {name: "Open spaces with little or no vegetation", class: 3},
    "41": {name: "Inland wetlands", class: 4},
    "42": {name: "Coastal wetlands", class: 4},
    "51": {name: "Inland waters", class: 5},
    "52": {name: "Marine waters", class: 5},
  };



  corineClassDropdownOptions = {
    fullTextSearch: 'exact',
    clearable: true,
  };

  getCorineClassFromUrlHashParams(hashParams: URLSearchParams): string {

    console.log("hashParams", hashParams);

    // 1. extract the corine class from URL
    const corineClassFromUrl: string | null = hashParams.get('land-cover-thematic-accuracy--corine_class');

    // 2.undefined should return an empty string
    if (corineClassFromUrl == null) {
      return "";
    }
    // 3. if the corine class is not in the map, return an empty string
    if (!Object.keys(this.corineClassMapLevel2).includes(corineClassFromUrl)) {
      return "";
    }

    return corineClassFromUrl;
  }
  ngOnInit() {
    this.selectedCorineClassIds = this.getCorineClassFromUrlHashParams(this.hashParams);

  }
}
