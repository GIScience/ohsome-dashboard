import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import {ControlContainer, FormsModule, NgForm} from '@angular/forms';
import {Checkbox, Indicator, RawQualityDimensionMetadata, Topic} from '../../types/types';
import {OqtApiMetadataProviderService} from '../../oqt-api-metadata-provider.service';
import {Userlayer} from '../../../shared/shared-types';
import {StateService} from '../../../singelton-services/state.service';
import {UrlHashParamsProviderService} from '../../../singelton-services/url-hash-params-provider.service';
import {
  SuiMultiSelectSearchDropdownComponent
} from '../../../shared/components/sui-dropdown/sui-multi-select-search-dropdown.component';
import {PrismEditorComponent} from '../../../shared/components/prism-editor/prism-editor.component';
import {SimpleIndicatorComponent} from './simple-indicator/simple-indicator.component';
import {
  AttributeCompletenessAttributesComponent
} from './attribute-completeness-attributes/attribute-completeness-attributes.component';
import {ThematicAccuracyIndicatorComponent} from './thematic-accuracy-indicator/thematic-accuracy-indicator.component';
import {KeyValuePipe} from '@angular/common';
import {disabled, form, FormField, required} from '@angular/forms/signals';
import {MEASURE_OPTIONS} from '../../../shared/utils/form.utils';

@Component({
  selector: 'app-oqt-api-query-form',
  templateUrl: './oqt-api-query-form.component.html',
  styleUrls: ['./oqt-api-query-form.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SuiMultiSelectSearchDropdownComponent, PrismEditorComponent, SimpleIndicatorComponent, AttributeCompletenessAttributesComponent, KeyValuePipe, ThematicAccuracyIndicatorComponent, FormField]
})
export class OqtApiQueryFormComponent implements OnInit, OnDestroy {

  protected stateService = inject(StateService);
  protected oqtApiMetadataProviderService = inject(OqtApiMetadataProviderService);
  protected renderer = inject(Renderer2);
  protected urlHashParamsProviderService = inject(UrlHashParamsProviderService);

  //new
  qualityFormModel = this.stateService.qualityFormModel;
  qualityForm = form(this.qualityFormModel, (schemaPath) => {
    required(schemaPath.measure);
    disabled(schemaPath.measure, {when: ({valueOf}) => valueOf(schemaPath.topic) !== 'custom-topic'});
  });

  // Measure
  protected measureOptions = MEASURE_OPTIONS;

  //new

  hashParamsSignal = computed(() => this.urlHashParamsProviderService.currentHashParams());

  //init sub form inputs
  hashParams = this.stateService.initialHashParams;


  @Output() changeIndicatorCoverages = new EventEmitter<Userlayer[]>()
  private indicatorCoverages: Userlayer[] = [];

  // For the ui we need

  // 1. the selected topic (selectedTopicKey)
  // 2. quality dimensions of the selected topic's indicators
  // 3. possible indicators of the selected topic, assigned to quality-dimensions
  // therefore: we enrich the topics object such that we can lookup the topic related indicators by the indicators quality-dimension
  //            we want topics[selectedTopicKey].quality_dimension[qualityDimensionKey].indicators[index]
  private _selectedTopicKey: string;

  // Topics
  public topics: Record<string, Topic> = {};

  // Indicators
  public indicators: Record<string, Checkbox<Indicator>>;
  public defaultCheckedIndicators: string[] = ['mapping-saturation'];

  //Quality Dimensions
  public qualityDimensions: Record<string, RawQualityDimensionMetadata>;
  // current quality dimensions to display based on the selected topic
  public currentQualityDimensions: Set<string> = new Set();

  // Set values from Permalink
  // topic //TODO get from state service
  topicParamSignal = this.stateService.sharedFormSignals.topic
  // topicParamSignal = computed(() => {
  //   // const topicParam = this.hashParamsSignal().get('topic');
  //   // const topicParam = this.stateService.appState().topic;
  //   const topicParam = this.stateService.sharedFormSignals.topic();
  //   // TODO check and set default in state service
  //   return (topicParam && Object.keys(this.topics).includes(topicParam)) ? topicParam : Utils.loadEnv('defaultTopicKey',Object.keys(this.topics)[0]) ;
  // });

  // // custom topic (title and filter)
  // topicTitleDefinition = computed(() => {
  //   return this.hashParamsSignal().get('topic-title') ?? '';
  // });

  // topicFilterDefinition = computed(() => {
  //   return this.hashParamsSignal().get('topic-filter') ?? '';
  // })

  // indicators
  indicatorsParamSignal = computed(() => {
    // return this.hashParamsSignal().get('indicators');
    return this.stateService.qualityFormModel().indicators.join();

  });

  constructor() {
    // linkField(this.qualityFormModel, 'topic', this.stateService.sharedFormSignals['topic']);
    // linkField(this.qualityFormModel, 'topic-filter', this.stateService.sharedFormSignals['topic-filter']);

    effect(() => {
      console.log("1 topic", this.topicParamSignal())
      this.selectedTopicKey = this.topicParamSignal();
      // on topic change, check if a stored custom topic is available and use it
      // if (this.selectedTopicKey === "custom-topic") {
      //   console.log("hello")
      //   const appState = this.stateService.appState();
      //   if (appState.customTopicTitle && appState.customTopicFilter) {
      //     this.urlHashParamsProviderService.updateHashParams({
      //       'topic-title': appState.customTopicTitle,
      //       'topic-filter': appState.customTopicFilter,
      //     })
      //   }
      // }
    });

    effect(() => {
      console.log("2 indicator", this.indicatorsParamSignal())
      this.setIndicators(this.indicatorsParamSignal());
    });

    effect(() => {
      const topic = this.qualityFormModel().topic;
      if (topic !== 'custom-topic') {
        this.qualityForm.measure().value.set(this.oqtApiMetadataProviderService.getTopicMeasure(topic));
      }
    });

    // update appState to store custom topic init when coming form url
    // this.stateService.updatePartialState({
    //     customTopicTitle: this.topicTitleDefinition(),
    //     customTopicFilter: this.topicFilterDefinition()
    //   }
    // )

  }

  ngOnInit(): void {
    // get metadata and enrich it to fill the form view
    this.indicators = this.getEnrichedIndicators();
    this.topics = this.getEnrichedTopics(this.indicators);
    this.qualityDimensions = structuredClone(this.oqtApiMetadataProviderService.getOqtApiMetadata().result['qualityDimensions']);
  }

  ngOnDestroy() {
    //cleanup
    this.indicatorCoverages = [];
    this.changeIndicatorCoverages.emit([]);
  }

  getEnrichedIndicators(): Record<string, Checkbox<Indicator>> {
    const enrichedIndicators = structuredClone(this.oqtApiMetadataProviderService.getOqtApiMetadata().result.indicators) as Record<string, Checkbox<Indicator>>;
    // initialise all indicator checkbox objects as unchecked except the default checked ones (see ngOnInit)
    Object.keys(enrichedIndicators).forEach(indicatorKey => {
      enrichedIndicators[indicatorKey].checked = false;
      enrichedIndicators[indicatorKey].key = indicatorKey;
    });

    return enrichedIndicators;
  }

  getEnrichedTopics(enrichedIndicators: Record<string, Checkbox<Indicator>>): Record<string, Topic> {
    // enrich topics with their indicators per qualityDimension
    const enrichedTopics = structuredClone(this.oqtApiMetadataProviderService.getOqtApiMetadata().result.topics) as Record<string, Topic>;
    Object.keys(enrichedTopics)
      .forEach(topicKey => {
        const topic = enrichedTopics[topicKey] as Topic;
        // add new properties
        topic.key = topicKey;
        topic.qualityDimensions = {};
        topic.indicators
          .forEach(topicIndicatorKey => {
            //is topic indicator available in indicators list?
            const topicIndicator = enrichedIndicators[topicIndicatorKey];
            if (!topicIndicator) {
              return;
            }
            // currently indicator --> quality_dimension is a 1:1 relation. Removing the brackets [] will allow a 1:n relation
            const qualityDimensions = [topicIndicator['qualityDimension']];
            qualityDimensions.forEach((qualityDimension) => {
              if ((topic as Required<Topic>).qualityDimensions[qualityDimension]) {
                (topic as Required<Topic>).qualityDimensions[qualityDimension].push(topicIndicator);
              } else {
                (topic as Required<Topic>).qualityDimensions[qualityDimension] = [topicIndicator];
              }
            });
          });
      });
    return enrichedTopics;
  }

  updateCurrentQualityDimensions(topicKey: string) {

    // ignore empty calls
    if (topicKey == undefined || topicKey.trim() === '') {
      return;
    }

    // get a list of quality dimensions for the selected topic
    // 1. From selected topic, get all indicator-keys
    // 2. With indicator-keys lookup quality dimensions
    // 3. Add all dimension to a Set to ensure uniqueness
    // 4. assign new Set to bound variable currentQualityDimensions in one go
    const tempCurrentQualityDimensions: Set<string> = new Set();

    this.topics[topicKey].indicators
      .flatMap((indicatorKey: string) => [this.indicators[indicatorKey]?.['qualityDimension']] as Array<string | undefined>)
      .forEach(qualityDimension => {
        if (qualityDimension) {
          tempCurrentQualityDimensions.add(qualityDimension);
        }
      });

    this.currentQualityDimensions = tempCurrentQualityDimensions;

  }

  get selectedTopicKey() {
    return this._selectedTopicKey;
  }

  set selectedTopicKey(topicKey: string) {
    console.log('selected Topic Key', topicKey);
    // ignore empty calls
    if (topicKey == undefined || topicKey.trim() === '') {
      return;
    }
    this._selectedTopicKey = topicKey;

    this.updateCurrentQualityDimensions(topicKey);

    this.updateIndicatorCoverages();

    this.stateService.sharedFormSignals.topic.set(topicKey);
  }

  setIndicators(indicatorsParam: string | null) {
    console.log(">>>>>>>set indicators", indicatorsParam);
    let indicatorValues = indicatorsParam?.split(',').filter((ele) => ele.trim() !== '');
    indicatorValues = (!indicatorValues || indicatorValues.length === 0) ? this.defaultCheckedIndicators : indicatorValues;
    indicatorValues.forEach(indicator => this.indicators[indicator].checked = true);
  }

  private updateIndicatorCoverages() {
    //cleanup
    this.indicatorCoverages = [];
    this.changeIndicatorCoverages.emit([]);

    // get a list of checked indicators
    // request coverages for all checked indicators
    // emit each separately whenever a coverage is loaded

    const checkedIndicators = Object.keys(this.indicators)
      .filter(indicatorKey =>
        this.indicators[indicatorKey].checked &&
        this.topics[this.selectedTopicKey].indicators.includes(indicatorKey)
      );

    for (const indicatorKey of checkedIndicators) {
      (async () => {
        const maskedUserLayer = await this.oqtApiMetadataProviderService.getIndicatorCoverage(indicatorKey);
        this.indicatorCoverages.push(maskedUserLayer);
        this.changeIndicatorCoverages.emit(this.indicatorCoverages);
      })();
    }

  }

  onIndicatorToggle(event: { indicator: Indicator; state: boolean; }) {
    // TODO this is a temp solution keep quality model in sync
    // console.log('onIndicatorToggle', event);
    this.stateService.qualityFormModel.update((old) => {
      const indicators = new Set(old.indicators);
      if (event.state) {
        indicators.add(event.indicator.key)
      }
      else {
        indicators.delete(event.indicator.key)
      }

      return {
        ...old,
        indicators: Array.from(indicators)
      }
    });
    //end temp solution

    this.updateIndicatorCoverages();
  }

  setCustomTopicTitleDefinition(title: string) {
    // this.urlHashParamsProviderService.updateHashParam('topic-title', title);
    // this.stateService.updatePartialState({'customTopicTitle': title});
    // this.stateService.sharedFormSignals.topic.set(title);
    this.qualityForm['topic-title']().value.set(title);
  }

  // setCustomTopicFilterDefinition(filter: string) {
  //   this.urlHashParamsProviderService.updateHashParam('topic-filter', filter);
  //   this.stateService.updatePartialState({'customTopicFilter': filter});
  //   //stored filter to 'custom-topic' todo remove
  //   this.topics[this.selectedTopicKey].filter = filter;
  // }

  protected setCustomTopic() {
    // this.extractionForm.topic().value.set('custom-topic');
    this.qualityFormModel.update((old) => {
      const oldTopic = this.topics[old.topic];
      return {
        ...old,
        topic: 'custom-topic',
        "topic-title": oldTopic.name,
        "topic-filter": oldTopic.filter
      }
    });
  }

  // setCustomTopic() {
  //   let customTopic = {
  //     "topic": "custom-topic",
  //     "topic-title": this.topics[this.selectedTopicKey].name,
  //     "topic-filter": this.topics[this.selectedTopicKey].filter
  //   }
  //   //TODO remove hash param update and handle through service and in hashparam service
  //   // this.urlHashParamsProviderService.updateHashParams(customTopic);
  //   this.stateService.sharedFormSignals['topic-title'].set(customTopic['topic-title']);
  //   this.stateService.sharedFormSignals['topic-filter'].set(customTopic['topic-filter']);
  //   this.stateService.sharedFormSignals.topic.set(customTopic.topic);
  //
  //   // this.stateService.updatePartialState({
  //   //   // topic: customTopic['topic'],
  //   //   customTopicTitle: customTopic['topic-title'],
  //   //   customTopicFilter: customTopic['topic-filter'],
  //   // })
  // }
}
