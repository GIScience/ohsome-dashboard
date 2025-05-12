import {
  Component,
  Input,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';


@Component({
  selector: 'app-thematical-accuracy-indicator',
  templateUrl: './thematical-accuracy-indicator.component.html',
  styleUrls: ['./thematical-accuracy-indicator.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],

  standalone: false,
})
export class ThematicalAccuracyIndicatorComponent {
  @Input({required: true}) indicatorKey!: string;
  @Input() selectOptions!: { label: string; value: number }[];
  selectedCorineClassIds: string | null = null;

  corineClassMap = {
    "11": {name: "Artificial areas: Urban fabric"},
    "12": {name: "Artificial areas: Industrial, commercial and transport units"},
    "13": {name: "Artificial areas: Mine, dump and construction sites"},
    "14": {name: "Artificial areas: Artificial non-agricultural vegetated areas"},
    "21": {name: "Agricultural areas: Arable land"},
    "22": {name: "Agricultural areas: Permanent crops"},
    "23": {name: "Agricultural areas: Pastures"},
    "24": {name: "Agricultural areas: Heterogeneous agricultural areas"},
    "31": {name: "Forest and semi-natural areas: Forest"},
    "32": {name: "Forest and semi-natural areas: Shrubs and/or herbaceous vegetation associations"},
    "33": {name: "Forest and semi-natural areas: Open spaces with little or no vegetation"},
    "41": {name: "Wetlands: Inland wetlands"},
    "42": {name: "Wetlands: Coastal wetlands"},
    "51": {name: "Water bodies: Inland waters"},
    "52": {name: "Water bodies: Marine waters"},
  };


  corineClassDropdownOptions = {
    fullTextSearch: 'exact',
    clearable: true,
  };
}
