import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {PRISM_LANGUAGE_OHSOME_FILTER} from '../../../../prism-language-ohsome-filter';
import {Checkbox, Indicator, RawQualityDimensionMetadata, Topic, OqtAttribute} from '../../types/types';
import {OqtApiMetadataProviderService} from '../../oqt-api-metadata-provider.service';
import {Userlayer} from '../../../shared/shared-types';
import {KeyValue} from "@angular/common";

declare const $, Prism;

@Component({
  selector: 'app-oqt-api-query-form',
  templateUrl: './oqt-api-query-form.component.html',
  styleUrls: ['./oqt-api-query-form.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
})
export class OqtApiQueryFormComponent implements OnInit, OnDestroy {

  @Input() hashParams: URLSearchParams = new URLSearchParams();
  @Output() changeIndicatorCoverages = new EventEmitter<Userlayer[]>()
  private indicatorCoverages: Userlayer[] = [];

  private oqtApiMetadataProviderService: OqtApiMetadataProviderService;
  private renderer: Renderer2;

  @ViewChild('topicFilter', {static: false}) preElem: ElementRef<HTMLPreElement>;


  // For the ui we need

  // 1. the selected topic (selectedTopicKey)
  // 2. quality dimensions of the selected topic's indicators
  // 3. possible indicators of the selected topic, assigned to quality-dimensions
  // therefore: we enrich the topics object such that we can lookup the topic related indicators by the indicators quality-dimension
  //            we want topics[selectedTopicKey].quality_dimension[qualityDimensionKey].indicators[index]
  private _selectedTopicKey: string;

  selectedAttributeKey: string;

  // Topics
  public topics: Record<string, Topic> = {};

  //Attributes
  public attributes: Record<string, Record<string, OqtAttribute>>;

  // Indicators
  public indicators: Record<string, Checkbox<Indicator>>;
  private defaultCheckedIndicators: string[] = ['mapping-saturation'];

  //Quality Dimensions
  public qualityDimensions: Record<string, RawQualityDimensionMetadata>;
  // current quality dimensions to display based on the selected topic
  public currentQualityDimensions: Set<string> = new Set();

  constructor(oqtApiMetadataProviderService: OqtApiMetadataProviderService, renderer: Renderer2, private cdRef: ChangeDetectorRef) {
    this.oqtApiMetadataProviderService = oqtApiMetadataProviderService;
    this.renderer = renderer;

    // prepare syntax highlighting for ohsome-filter
    Prism.languages['ohsome-filter'] = PRISM_LANGUAGE_OHSOME_FILTER;
  }

  ngOnInit(): void {
    // get metadata and enrich it to fill the form view
    this.indicators = this.getEnrichedIndicators();
    this.topics = this.getEnrichedTopics(this.indicators);
    this.qualityDimensions = structuredClone(this.oqtApiMetadataProviderService.getOqtApiMetadata().result['qualityDimensions']);
    this.attributes = this.oqtApiMetadataProviderService.getAttributes().result


    // fill form with hash or default values
    // set topic
    const topicValue = this.hashParams.get('topic');
    this.selectedTopicKey = (topicValue && Object.keys(this.topics).includes(topicValue)) ? topicValue : Object.keys(this.topics)[0];

    this.selectedAttributeKey = this.hashParams.get('attribute') || "";
    //set indicators
    const indicatorValues = this.hashParams.get('indicators')?.split(',') || this.defaultCheckedIndicators;
    indicatorValues.forEach(indicator => this.indicators[indicator].checked = true);

    // init semantic-ui
    this.initTopicDropdown();
  }

  ngOnDestroy() {
    //cleanup
    this.indicatorCoverages = [];
    this.changeIndicatorCoverages.emit([]);
  }

  getEnrichedIndicators(): Record<string, Checkbox<Indicator>> {
    const enrichedIndicators = structuredClone(this.oqtApiMetadataProviderService.getOqtApiMetadata().result.indicators) as Record<string, Checkbox<Indicator>>;
    // initialise all indicator checkbox objects as unchecked except the deafult checked ones
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
        // add new property
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

    // get a list of quality dimensions for the selected topic
    // 0. clear former entries
    // 1. From selected topic, get all indicator-keys
    // 2. With indicator-keys lookup quality dimensions
    // 3. Add all dimension to a Set to ensure uniqueness
    this.currentQualityDimensions.clear();

    this.topics[topicKey].indicators
      .map(value => {
        console.log(value);
        return value;
      })
      .flatMap((indicatorKey: string) => [this.indicators[indicatorKey]?.['qualityDimension']] as Array<string | undefined>)
      .forEach(qualityDimension => {
        if (qualityDimension) {
          this.currentQualityDimensions.add(qualityDimension);
        }
      });
    console.log('qualityDimensions', this.currentQualityDimensions);

    this.initIndicatorCoverages();
  }


  private initTopicDropdown() {
    setTimeout(() => {
      $('.ui.dropdown').dropdown({
        fullTextSearch: 'exact'
      });
      $('.ui.dropdown').dropdown('set exactly', this.selectedTopicKey);
    }, 500);
  }

  private initIndicatorCoverages() {
    //cleanup
    this.indicatorCoverages = [];
    this.changeIndicatorCoverages.emit([]);

    // get a list of checked indicators
    // request coverages for all checked indicators
    Object.keys(this.indicators).forEach(indicatorKey => {
      // only add coverage for indicators that are checked and available for the current selected topic
      if (this.indicators[indicatorKey].checked && this.topics[this.selectedTopicKey].indicators.includes(indicatorKey)) {
        console.log("initIndicatorCoverages", indicatorKey);
        this.addIndicatorCoverage(indicatorKey);
      }
    });
  }

  private async addIndicatorCoverage(indicatorKey: string) {

    const maskedUserLayer = await this.oqtApiMetadataProviderService.getIndicatorCoverage(indicatorKey);

    this.indicatorCoverages.push(maskedUserLayer);
    this.changeIndicatorCoverages.emit(this.indicatorCoverages);
  }

  onTopicChange() {
    const filter = this.topics[this.selectedTopicKey].filter;
    // reset selected attribute
    this.selectedAttributeKey = "";
    //update filter highlighting
    if (filter) {
      const highlightedHTML = Prism.highlight(filter, Prism.languages['ohsome-filter'], 'ohsome-filter');
      this.renderer.setProperty(this.preElem.nativeElement, 'innerHTML', highlightedHTML);
    } else {
      this.renderer.setProperty(this.preElem.nativeElement, 'innerHTML', '');
    }
  }

  onIndicatorToggle(indicatorToggleEvent) {
    console.log("indicatorToggleEvent", indicatorToggleEvent)

    //clear indicator coverages and re init
    this.initIndicatorCoverages();
  }

  getNameOfCurrentAttribute(pair: KeyValue<string, OqtAttribute> ) {
    return pair.value.name
  }

  getKeyOfCurrentAttribute(pair: KeyValue<string, OqtAttribute> ) {
    return pair.key
  }

  getEntriesForSelectedTopicKey(): Record<string, OqtAttribute> {
    if (this.attributes[this.selectedTopicKey]  !== undefined) {
      return this.attributes[this.selectedTopicKey]
    }
    else {
      return {}
    }
  }

}
