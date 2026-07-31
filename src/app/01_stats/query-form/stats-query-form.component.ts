import {Component, computed, inject} from '@angular/core';
import {BoundaryInputComponent} from '../../shared/components/boundary-input/boundary-input.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {KeyValuePipe} from '@angular/common';
import {PrismEditorComponent} from '../../shared/components/prism-editor/prism-editor.component';
import {
  SuiMultiSelectSearchDropdownComponent
} from '../../shared/components/sui-dropdown/sui-multi-select-search-dropdown.component';
import {form, FormField, required, submit} from '@angular/forms/signals';
import {StatsFormData} from '../../03_extraction/query-form/types';
import Utils from '../../../utils';
import {DataService} from '../../singelton-services/data.service';
import {StateService} from '../../singelton-services/state.service';
import {OhsomeApiMetadataProviderService} from '../../ohsomeapi/ohsome-api-metadata-provider.service';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';
import {BoundaryInputComponentOptions} from '../../shared/shared-types';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-stats-query-form',
  imports: [
    BoundaryInputComponent,
    FormsModule,
    KeyValuePipe,
    PrismEditorComponent,
    ReactiveFormsModule,
    SuiMultiSelectSearchDropdownComponent,
    FormField
  ],
  templateUrl: './stats-query-form.component.html',
  styleUrl: './stats-query-form.component.css',
})
export class StatsQueryFormComponent {
// urlHashParamsProviderService = inject(UrlHashParamsProviderService);
  stateService = inject(StateService);
  ohsomeApiMetadataProviderService = inject(OhsomeApiMetadataProviderService);
  ohsomeQualityApiMetadataProviderService = inject(OqtApiMetadataProviderService);
  dataservice = inject(DataService);

  topics = this.ohsomeQualityApiMetadataProviderService.getOqtApiMetadata().result.topics;
  // Measure
  protected measureOptions: { value: string; label: string }[] = [
    {value: 'count', label: $localize`count`},
    {value: 'length', label: $localize`length`},
    {value: 'area', label: $localize`area`}
  ];

  // this info survives component recreation in state service
  statsFormModel = this.stateService.statsFormModel;

  statsForm = form(this.statsFormModel, (schemaPath)=>{
    required(schemaPath.aoi);
    required(schemaPath.measure);
  });

  protected mapOptions: BoundaryInputComponentOptions = {
    center: environment.mapCenter ?? {lat: 0, lng: 0},
    zoom: environment.zoomLevel ?? 5,
  };

  protected readonly filterFromTopic = computed(() => {
    const topic = this.statsFormModel().topic;
    console.log(topic);
    {
      if (topic !== 'custom-topic') {
        const filter = this.ohsomeQualityApiMetadataProviderService.getOqtApiMetadata().result.topics[topic].filter;
        return filter;
      }
    }

    return this.statsFormModel()['topic-filter'];
  });

  async onSubmit(event: Event | null) {
    event?.preventDefault();

    submit(this.statsForm, async () => {
      // Add logic here
      const formValues = {...this.statsForm().value(), backend: 'ohsomeApi'};

      console.log("STATS FORM", this.statsForm().value());

      //TODO make boundary type dependant on choosen boundary type (map)
      this.dataservice.pushFormValues(formValues, 'bbox')
    });
  }

  static buildInitialModel(initialHashParams: URLSearchParams): StatsFormData {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const today = now.toISOString().replace(/\.\d*Z/, '');
    return {
      topic: '',
      "topic-title": '',
      "topic-filter": '',
      aoi: initialHashParams.get('aoi') ?? '',
      // time: Utils.getFromParamsOrDefault(initialHashParams, 'time', `/${today}/P1M`),
      measure: Utils.getFromParamsOrDefault(initialHashParams, 'measure', `count`),
      start: Utils.getFromParamsOrDefault(initialHashParams, 'start', '2010-01-01T00:00'),
      end: Utils.getFromParamsOrDefault(initialHashParams, 'end', today),
      interval: Utils.getFromParamsOrDefault(initialHashParams, 'interval', 'P1M'),
    }
  }

  protected setCustomTopic() {
    this.statsFormModel.update((old) => {
      const oldTopic = this.ohsomeQualityApiMetadataProviderService.getOqtApiMetadata().result.topics[old.topic];
      return {
        ...old,
        topic: 'custom-topic',
        "topic-title": oldTopic.name,
        "topic-filter": oldTopic.filter
      }
    });
  }
}
