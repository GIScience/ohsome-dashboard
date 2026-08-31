import {Component, computed, effect, inject, signal} from '@angular/core';
import {ControlContainer, FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {KeyValuePipe} from '@angular/common';
import {PrismEditorComponent} from '../../shared/components/prism-editor/prism-editor.component';
import {
  SuiMultiSelectSearchDropdownComponent
} from '../../shared/components/sui-dropdown/sui-multi-select-search-dropdown.component';
import {disabled, form, FormField, required, submit} from '@angular/forms/signals';
import {StatsFormData} from '../../03_extraction/query-form/types';
import Utils from '../../../utils';
import {DataService} from '../../singelton-services/data.service';
import {StateService} from '../../singelton-services/state.service';
import {OhsomeApiMetadataProviderService} from '../../ohsomeapi/ohsome-api-metadata-provider.service';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';
import {BoundaryInputComponentOptions} from '../../shared/shared-types';
import {environment} from '../../../environments/environment';
import {MEASURE_OPTIONS} from '../../shared/utils/form.utils';

@Component({
  selector: 'app-stats-query-form',
  imports: [
    FormsModule,
    KeyValuePipe,
    PrismEditorComponent,
    ReactiveFormsModule,
    SuiMultiSelectSearchDropdownComponent,
    FormField
  ],
  templateUrl: './stats-query-form.component.html',
  styleUrl: './stats-query-form.component.css',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
})
export class StatsQueryFormComponent {
// urlHashParamsProviderService = inject(UrlHashParamsProviderService);
  stateService = inject(StateService);
  ohsomeApiMetadataProviderService = inject(OhsomeApiMetadataProviderService);
  ohsomeQualityApiMetadataProviderService = inject(OqtApiMetadataProviderService);
  dataservice = inject(DataService);

  topics = this.ohsomeQualityApiMetadataProviderService.getOqtApiMetadata().result.topics;
  // Measure
  protected measureOptions = MEASURE_OPTIONS;

  // Period
  protected periodOptions: { value: string, label: string }[] = [
    {value: 'PT1H', label: $localize`hourly`},
    {value: 'P1D', label: $localize`daily`},
    {value: 'P1W', label: $localize`weekly`},
    {value: 'P1M', label: $localize`monthly`},
    {value: 'P3M', label: $localize`quarterly`},
    {value: 'P1Y', label: $localize`yearly`},
  ];

  // this info survives component recreation in state service
  statsFormModel = this.stateService.statsFormModel;

  statsForm = form(this.statsFormModel, (schemaPath) => {
    // required(schemaPath.aoi);
    required(schemaPath['topic-filter'], {
      when: ({valueOf}) => valueOf(schemaPath.topic) === 'custom-topic',
      message: ' An ohsome filter is required.'
    });
    required(schemaPath.measure);
    disabled(schemaPath.measure, {when: ({valueOf}) => valueOf(schemaPath.topic) !== 'custom-topic'});
    required(schemaPath.groupByTagKey, {when: () => this.groupByTag()});
  });

  isValidStatsForm = this.stateService.isValidStatsForm;



  groupByTag = signal<boolean>(!!Utils.getFromParamsOrDefault(this.stateService.initialHashParams, 'groupByTagKey', ''));

  protected mapOptions: BoundaryInputComponentOptions = {
    center: environment.mapOptions.center ?? {lat: 0, lng: 0},
    zoom: environment.mapOptions.zoom ?? 5,
  };

  protected readonly filterFromTopic = computed(() => {
    const topic = this.statsFormModel().topic;
    if (topic !== 'custom-topic') {
      return this.ohsomeQualityApiMetadataProviderService.getTopicFilter(topic);
    }
    return this.statsFormModel()['topic-filter'];
  });

  constructor() {
    effect(() => {
      const topic = this.statsFormModel().topic;
      if (topic !== 'custom-topic') {
        this.statsForm.measure().value.set(this.ohsomeQualityApiMetadataProviderService.getTopicMeasure(topic));
      }
    });

    effect(() => {
      if (!this.groupByTag()) {
        this.statsForm.groupByTagKey().value.set('');
      }
    });

    effect(() => {
      this.isValidStatsForm.set(this.statsForm().valid());
    });
  }

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
      aoi: initialHashParams.get('aoi') ?? '', //TODO remove
      measure: Utils.getFromParamsOrDefault(initialHashParams, 'measure', `count`),
      clip: Utils.getFromParamsOrDefault<boolean>(initialHashParams, 'clip', false),
      start: Utils.getFromParamsOrDefault(initialHashParams, 'start', '2010-01-01T00:00'),
      end: Utils.getFromParamsOrDefault(initialHashParams, 'end', today),
      interval: Utils.getFromParamsOrDefault(initialHashParams, 'interval',Utils.loadEnv('interval', 'P1M')),
      groupByTagKey: Utils.getFromParamsOrDefault(initialHashParams, 'groupByTagKey', ''),
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
