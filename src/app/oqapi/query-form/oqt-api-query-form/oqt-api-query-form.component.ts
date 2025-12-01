import {Component, computed, effect, EventEmitter, inject, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import {Checkbox, Indicator, RawQualityDimensionMetadata, Topic} from '../../types/types';
import {OqtApiMetadataProviderService} from '../../oqt-api-metadata-provider.service';
import {Userlayer} from '../../../shared/shared-types';
import {StateService} from '../../../singelton-services/state.service';
import {UrlHashParamsProviderService} from '../../../singelton-services/url-hash-params-provider.service';
import { SuiMultiSelectSearchDropdownComponent } from '../../../shared/components/sui-dropdown/sui-multi-select-search-dropdown.component';
import { PrismEditorComponent } from '../../../shared/components/prism-editor/prism-editor.component';
import { SimpleIndicatorComponent } from './simple-indicator/simple-indicator.component';
import { AttributeCompletenessAttributesComponent } from './attribute-completeness-attributes/attribute-completeness-attributes.component';
import { ThematicalAccuracyIndicatorComponent } from './thematical-accuracy-indicator/thematical-accuracy-indicator.component';
import { KeyValuePipe } from '@angular/common';

@Component({
    selector: 'app-oqt-api-query-form',
    templateUrl: './oqt-api-query-form.component.html',
    styleUrls: ['./oqt-api-query-form.component.css'],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [FormsModule, SuiMultiSelectSearchDropdownComponent, PrismEditorComponent, SimpleIndicatorComponent, AttributeCompletenessAttributesComponent, ThematicalAccuracyIndicatorComponent, KeyValuePipe]
})
export class OqtApiQueryFormComponent implements OnInit, OnDestroy {

  protected stateService = inject(StateService);
  protected oqtApiMetadataProviderService = inject(OqtApiMetadataProviderService);
  protected renderer = inject(Renderer2);
  protected urlHashParamsProviderService = inject(UrlHashParamsProviderService);

  hashParamsSignal = computed(() => this.urlHashParamsProviderService.currentHashParams());
  hashParams = this.hashParamsSignal();

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
  private defaultCheckedIndicators: string[] = ['mapping-saturation'];

  //Quality Dimensions
  public qualityDimensions: Record<string, RawQualityDimensionMetadata>;
  // current quality dimensions to display based on the selected topic
  public currentQualityDimensions: Set<string> = new Set();

  topicParamSignal = computed(()=> {
    const topicParam = this.hashParamsSignal().get('topic');
    return (topicParam && Object.keys(this.topics).includes(topicParam)) ? topicParam : Object.keys(this.topics)[0];
  });
  indicatorsParamSignal = computed(()=> {
    return this.hashParamsSignal().get('indicators');

  });
  constructor() {

    effect(() => {
      console.log("3 topic", this.topicParamSignal())
      this.selectedTopicKey = this.topicParamSignal();
    });

    effect(() => {
      console.log("4 indicator", this.indicatorsParamSignal())
      this.setIndicators(this.indicatorsParamSignal());
    });
  }

  ngOnInit(): void {
    // get metadata and enrich it to fill the form view
    this.indicators = this.getEnrichedIndicators();
    this.topics = this.getEnrichedTopics(this.indicators);
    this.qualityDimensions = structuredClone(this.oqtApiMetadataProviderService.getOqtApiMetadata().result['qualityDimensions']);

    // fill form with hash or default values
    // set topic
    console.log("1 topic", this.hashParams.get('topic'));
    const topicParam = this.hashParams.get('topic');
    this.selectedTopicKey = (topicParam && Object.keys(this.topics).includes(topicParam)) ? topicParam : Object.keys(this.topics)[0];

    //set indicators
    console.log("2 indicator", this.hashParams.get('indicators'));
    this.setIndicators(this.hashParams.get('indicators'));

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
            //is topic indicator available in indicators list? This depends on the project query param
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

  }

  setIndicators(indicatorsParam: string | null) {
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
      (async ()=>{
        const maskedUserLayer = await this.oqtApiMetadataProviderService.getIndicatorCoverage(indicatorKey);
        this.indicatorCoverages.push(maskedUserLayer);
        this.changeIndicatorCoverages.emit(this.indicatorCoverages);
      })();
    }

  }

  onIndicatorToggle() {
    this.updateIndicatorCoverages();
  }

}
