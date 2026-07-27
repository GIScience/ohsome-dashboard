import {Component, computed, inject} from '@angular/core';
import {form, FormField, submit} from '@angular/forms/signals';
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

@Component({
  selector: 'app-extraction-query-form',
  imports: [
    PrismEditorComponent,
    FormField,
    KeyValuePipe,
    SuiMultiSelectSearchDropdownComponent,
    FormsModule
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

  extractionForm = form(this.extractionFormModel);

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

  constructor() {
    console.log("Extraction Query Form constructor");

    //set shared form fields
    // linkField(this.extractionFormModel, 'topic', this.stateService.sharedFormSignals['topic']);
    // Derive filter from topic and push it into the form model
    // derivedField(this.extractionFormModel, 'topic-filter', this.filterFromTopic);

    // effect(() => {
    //   const topic = this.extractionFormModel().topic;
    //   if (topic !== 'custom-topic') {
    //     console.log("effect extraction query", topic);
    //     const filter = this.ohsomeQualityApiMetadataProviderService.getOqtApiMetadata().result.topics[topic].filter;
    //     this.extractionFormModel.update((old) => ({...old, "topic-filter": filter}));
    //   }
    // });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.extractionForm, async () => {
      console.log('Create Extraction Asset', event);
      // Add logic here
      console.log("EXTRACTION FORM", this.extractionForm())
      this.dataservice.pushFormValues(this.extractionForm().value(), 'admin')
    });
  }

  static buildInitialModel(initialHashParams: URLSearchParams): ExtractionFormData {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const today = now.toISOString().replace(/\.\d*Z/, '');
    return {
      topic: '',
      "topic-title": '',
      "topic-filter": '',
      aoi: '',
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
