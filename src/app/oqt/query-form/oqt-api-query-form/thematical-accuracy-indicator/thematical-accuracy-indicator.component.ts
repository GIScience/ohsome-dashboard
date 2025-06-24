import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { corineLandCoverClassMapLevel2 } from './thematical-accuracy-indicator.constants';
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

  corineLandCoverClassMapLevel1 = {
    "1": {name: "Artificial surfaces"},
    "2": {name: "Agricultural areas"},
    "3": {name: "Forest and semi-natural areas"},
    "4": {name: "Wetlands"},
    "5": {name: "Water bodies"},
  }

  corineLandCoverClassMapLevel2 = corineLandCoverClassMapLevel2;


  corineLandCoverClassDropdownOptions = {
    fullTextSearch: 'exact',
    clearable: true,
  };

  getCorineLandCoverClassFromUrlHashParams(hashParams: URLSearchParams): string {

    console.log("hashParams", hashParams);

    // 1. extract the corine land cover class from URL
    const corineLandCoverClassFromUrl: string | null = hashParams.get('land-cover-thematic-accuracy--corine_land_cover_class');

    // 2.undefined should return an empty string
    if (corineLandCoverClassFromUrl == null) {
      return "";
    }
    // 3. if the corine class is not in the map, return an empty string
    if (!Object.keys(this.corineLandCoverClassMapLevel2).includes(corineLandCoverClassFromUrl)) {
      return "";
    }

    return corineLandCoverClassFromUrl;
  }
  ngOnInit() {
    this.selectedCorineClassIds = this.getCorineLandCoverClassFromUrlHashParams(this.hashParams);

  }
}
