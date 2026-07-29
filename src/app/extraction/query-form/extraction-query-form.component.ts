import {Component, computed, inject} from '@angular/core';
import {form, FormField, required, submit, validate} from '@angular/forms/signals';
import {PrismEditorComponent} from '../../shared/components/prism-editor/prism-editor.component';
import {OqtApiMetadataProviderService} from '../../oqapi/oqt-api-metadata-provider.service';
import {FormsModule} from '@angular/forms';
import {KeyValuePipe} from '@angular/common';
import {
  SuiMultiSelectSearchDropdownComponent
} from '../../shared/components/sui-dropdown/sui-multi-select-search-dropdown.component';
import {DataService} from '../../singelton-services/data.service';
import {StateService} from '../../singelton-services/state.service';
import {OhsomeApiMetadataProviderService} from '../../ohsomeapi/ohsome-api-metadata-provider.service';
import {ExtractionFormData} from './types';
import Utils from '../../../utils';
import {BoundaryInputComponent} from '../../shared/components/boundary-input/boundary-input.component';
import {BoundaryInputComponentOptions} from '../../shared/shared-types';
import {environment} from '../../../environments/environment';
import {toPng} from 'html-to-image';

@Component({
  selector: 'app-extraction-query-form',
  imports: [
    PrismEditorComponent,
    FormField,
    KeyValuePipe,
    SuiMultiSelectSearchDropdownComponent,
    FormsModule,
    BoundaryInputComponent
  ],
  templateUrl: './extraction-query-form.component.html',
  styleUrl: './extraction-query-form.component.css',
})

export class ExtractionQueryFormComponent {
  // urlHashParamsProviderService = inject(UrlHashParamsProviderService);
  stateService = inject(StateService);
  ohsomeApiMetadataProviderService = inject(OhsomeApiMetadataProviderService);
  ohsomeQualityApiMetadataProviderService = inject(OqtApiMetadataProviderService);
  dataservice = inject(DataService);

  topics = this.ohsomeQualityApiMetadataProviderService.getOqtApiMetadata().result.topics;

  // this info survives component recreation in state service
  extractionFormModel = this.stateService.extractionFormModel;

  extractionForm = form(this.extractionFormModel, (schemaPath)=>{
    required(schemaPath.aoi);
    validate(schemaPath.aoi, ({ value }) => {
      console.log("VALIDATOR", value());
      const numberOfShapes = value().toString().split('|').length;
      return numberOfShapes !== 1
        ? { kind: 'singleBboxRequired', message: 'A single bounding box is required.' }
        : null;
    });
  });

  protected boundaryType: string;

  protected readonly filterFromTopic = computed(() => {
    const topic = this.extractionFormModel().topic;
    console.log(topic);
    {
      if (topic !== 'custom-topic') {
        const filter = this.ohsomeQualityApiMetadataProviderService.getOqtApiMetadata().result.topics[topic].filter;
        return filter;
      }
    }

    return this.extractionFormModel()['topic-filter'];
  });

  protected mapOptions: BoundaryInputComponentOptions = {
    center: environment.mapCenter ?? {lat: 0, lng: 0},
    zoom: environment.zoomLevel ?? 5,
  };

  constructor() {
    console.log("Extraction Query Form constructor");
    // immediately trigger the query if there are hashparams
    if (this.stateService.appState().firstForm) {
      this.stateService.updatePartialState({firstForm: false});
      setTimeout(() => {
        if (this.extractionForm().valid()) {
          this.onSubmit(null);
        }
      }, 1000);
    }
  }

  async onSubmit(event: Event | null) {
    event?.preventDefault();
    const mapDataUrl = await this.getImageUrlFromMap();

    const formValues = {...this.extractionForm().value(), mapDataUrl};

    submit(this.extractionForm, async () => {
      console.log('Create Extraction Asset', event);
      // Add logic here
      console.log("EXTRACTION FORM", this.extractionForm())
      this.dataservice.pushFormValues(formValues, 'admin')
    });
  }

  async getImageUrlFromMap() {
    const node = document.querySelector<HTMLDivElement>('#boundaryMap');
    if (!node) return '';
    return await toPng(node);
  }

  static buildInitialModel(initialHashParams: URLSearchParams): ExtractionFormData {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const today = now.toISOString().replace(/\.\d*Z/, '');
    return {
      topic: '',
      "topic-title": '',
      "topic-filter": '',
      aoi: initialHashParams.get('aoi') ?? '',
      clip: initialHashParams.get('clip')?.toLowerCase() !== "false", //only "true" is true
      timestamp: Utils.getFromParamsOrDefault(initialHashParams, 'timestamp', today)
    }
  }

  protected setCustomTopic() {
    // this.extractionForm.topic().value.set('custom-topic');
    this.extractionFormModel.update((old) => {
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
