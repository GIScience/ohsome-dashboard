import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {PRISM_LANGUAGE_OHSOME_FILTER} from '../../../../prism-language-ohsome-filter';
import {Checkbox, Indicator, RawQualityDimensionMetadata, Topic} from '../../types/types';
import {OqtApiMetadataProviderService} from '../../oqt-api-metadata-provider.service';

declare const $, Prism;

@Component({
  selector: 'app-oqt-api-query-form',
  templateUrl: './oqt-api-query-form.component.html',
  styleUrls: ['./oqt-api-query-form.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
})
export class OqtApiQueryFormComponent implements OnInit {

  @Input() hashParams: URLSearchParams = new URLSearchParams();

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

  // Topics
  public topics: Record<string, Topic> = {};

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

    // fill form with hash or default values
    // set topic
    const topicValue = this.hashParams.get('topic');
    this.selectedTopicKey = (topicValue && Object.keys(this.topics).includes(topicValue)) ? topicValue : Object.keys(this.topics)[0];
    //set indicators
    const indicatorValues = this.hashParams.get('indicators')?.split(',') || this.defaultCheckedIndicators;
    indicatorValues.forEach(indicator => this.indicators[indicator].checked = true);

    // init semantic-ui
    this.initTopicDropdown();
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

  getEnrichedTopics(indicators: Record<string, Indicator>): Record<string, Topic> {
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
            const topicIndicator = this.indicators[topicIndicatorKey];
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
      .flatMap(indicatorKey => [this.indicators[indicatorKey]?.['qualityDimension']] as string[] | undefined)
      .forEach(qualityDimension => {
        if (qualityDimension) {
          this.currentQualityDimensions.add(qualityDimension);
        }
      });
    console.log('qualityDimensions', this.currentQualityDimensions);
  }


  initTopicDropdown() {
    setTimeout(() => {
      $('.ui.dropdown').dropdown('set exactly', this.selectedTopicKey);
    }, 500);
  }

  onTopicChange() {
    const filter = this.topics[this.selectedTopicKey].filter;
    //update filter highlighting
    if (filter) {
      const highlightedHTML = Prism.highlight(filter, Prism.languages['ohsome-filter'], 'ohsome-filter');
      this.renderer.setProperty(this.preElem.nativeElement, 'innerHTML', highlightedHTML);
    } else {
      this.renderer.setProperty(this.preElem.nativeElement, 'innerHTML', '');
    }
  }
}
