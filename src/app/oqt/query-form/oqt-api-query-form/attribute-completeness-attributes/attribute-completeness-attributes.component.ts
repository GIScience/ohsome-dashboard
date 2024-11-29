import {
  AfterContentInit,
  Component, ElementRef,
  Input, NgZone,
  OnChanges,
  OnInit, signal,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {OqtApiMetadataProviderService} from '../../../oqt-api-metadata-provider.service';
import {OqtAttribute} from '../../../types/types';

declare const $, Prism;

@Component({
  selector: 'app-attribute-completeness-attributes',
  templateUrl: './attribute-completeness-attributes.component.html',
  styleUrl: './attribute-completeness-attributes.component.css',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
})
export class AttributeCompletenessAttributesComponent implements OnInit, AfterContentInit, OnChanges {
  @Input() topicName!: string;
  @Input() selectedTopicKey!: string;
  @Input() hashParams!: URLSearchParams;
  @Input() indicatorKey!: string;
  @Input() indicatorChecked: boolean;
  @ViewChild('attributeFilter', {static: false}) preElem: ElementRef<HTMLPreElement>;

  oqtApiMetadataProviderService: OqtApiMetadataProviderService;
  attributes: Record<string, Record<string, OqtAttribute>>;
  selectedAttributeKeys: string[];

  combinedAttributeFilters: string;
  useCustomFilter  = signal(false);
  customFilterTitle: string = '';
  customFilterDefinition: string = '';

  constructor(oqtApiMetadataProviderService: OqtApiMetadataProviderService, private ngZone: NgZone) {
    this.oqtApiMetadataProviderService = oqtApiMetadataProviderService;
  }

  ngOnInit(): void {
    this.attributes = this.oqtApiMetadataProviderService.getAttributes().result;

    //extract and sanitize selectedAttributeKeys
    this.selectedAttributeKeys = this.getAttributeKeysFromUrlHashParams(this.hashParams);


  }

  ngAfterContentInit(): void {
    // directly initialize the indicator search dropdown when it is visible during component initialization
    this.initAttributeDropdown();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const topicChange: SimpleChange = changes['selectedTopicKey'];

    if (topicChange && !topicChange.firstChange) {
      //sanitize attributes
      $('#search-select-attribute').dropdown('clear');
      this.selectedAttributeKeys = this.sanitizeAttributeKeys(this.selectedAttributeKeys);
      this.initAttributeDropdown();
    }
  }

  initAttributeDropdown() {
    $('#search-select-attribute').dropdown({
      fullTextSearch: 'exact',
      clearable: true,
      // custom attribute labels for selected items with mouse events
      onLabelCreate: (value: string, text: string) => {
        const match = value.match(/:\s+'(.*)'$/);
        const attributeKey = match ? match[1] : '';
        const attributeFilter = this.attributes[this.selectedTopicKey][attributeKey].filter;

        return $(`<a class="ui label">${text}<i class="delete icon"></i></a>`)
          .attr('data-value', value)
          // click for modal with detailed attribute description
          .on('click', {attributeKey}, this.showAttributeDetails.bind(this))
          // hover for small popup with filter definition
          .popup({
              content: attributeFilter,
              variation: 'inverted'
            }
          )
          ;
      }
    });
  }

  showAttributeDetails(event) {
    // don't trigger modal if user clicks on close icon (X), only when directly clicked in the attribute label
    if (event.target != event.currentTarget) {
      return;
    }

    const attributeKey = event.data["attributeKey"] as string;
    const attribute = this.attributes[this.selectedTopicKey][attributeKey];

    const highlightedHTML = Prism.highlight(attribute.filter, Prism.languages['ohsome-filter'], 'ohsome-filter');

    // set content for the modal window with attribute metadata
    $('#attribute-details #title')
      .html(`<span class="ui circular label">${this.topicName}</span><br>${attribute.name}`);
    // $('#attribute-details #description')
    //   .html(attribute.description);
    $('#attribute-details #attributeFilter')
      .html(highlightedHTML);
    //.html(attribute.filter);

    $('#attribute-details').modal({
      inverted: true,
      duration: 200,
      // white background will be attached to <body>
      context: 'body',
      // dom for the modal content stays inside the component when detachable=false otherwise it would be moved to the
      // dimmer-DIV in <body> aswell
      detachable: false
    }).modal('show');
  }

  getAttributeKeysFromUrlHashParams(hashParams: URLSearchParams): string[] {

    // 1. extract the attributes from URL
    //  might be null, empty or a single string
    //  the single string might contain one or multiple attributeKeys seperated by "," (comma)
    const attributesFromUrl: string[] | undefined = hashParams.get('attribute-completeness--attributes')?.split(',').filter((ele) => ele.trim() !== '');

    // 2.undefined should return the defaultAttributeKey
    // this can happen when the URL specifies indicator=attribute-completeness but NOT attribute-completeness-attributes
    if (attributesFromUrl == undefined) {
      return [this.getDefaultAttributeKey(this.selectedTopicKey)];
    }
    // 3. convert to an array with one or more elements, an element can only be an empty string if there is no defaultAttribute
    return this.sanitizeAttributeKeys(attributesFromUrl);
  }

  sanitizeAttributeKeys(attributeKeyCandidates: string[]) {
    let attributeKeys: string[];

    //  1. only keep attributes that are valid for the current topic
    attributeKeys = attributeKeyCandidates.filter((attributeKeyCandidate) => {
      return this.isValidAttributeKey(this.selectedTopicKey, attributeKeyCandidate);
    });

    // 2. set default
    //  if after the conversion only an empty array exists set the first available attribute for the topic
    if (attributeKeys.length === 0) {
      attributeKeys = [this.getDefaultAttributeKey(this.selectedTopicKey)];
    }
    return attributeKeys;
  }

  isValidAttributeKey(topicKey: string, attributeKey: string): boolean {
    return (this.topicHasAttributes(topicKey) && !!this.attributes[topicKey][attributeKey]);
  }

  topicHasAttributes(topicKey: string): boolean {
    return (!!this.attributes[topicKey] && Object.keys(this.attributes[topicKey]).length > 0);
  }

  getDefaultAttributeKey(topicKey: string): string {
    return (this.topicHasAttributes(topicKey)) ? Object.keys(this.attributes[topicKey])[0] : '';
  }

  getAttributesByTopicKey(topicKey: string): Record<string, OqtAttribute> {
    if (this.topicHasAttributes(topicKey)) {
      return this.attributes[topicKey]
    } else {
      return {}
    }
  }

  combineSelectedAttributeFilters(): string {

    // get a valid attributeFilter list
    // can have 0...n filter elements
    const attributeFilterList: string[] = this.selectedAttributeKeys.flatMap((attributeKey) => {
      const filter = this.oqtApiMetadataProviderService.getAttributeFilter(this.selectedTopicKey, attributeKey);
      return filter != undefined ? [filter] : [];
    });

    switch (attributeFilterList.length) {
      case 0: {
        return '';
      }
      case 1: {
        return attributeFilterList[0];
      }
      default: {
        return concatFilters();
      }
    }

    // surround filters with brackets and concat them with ' and ' and add pretty linebreaks
    function concatFilters() {
      return attributeFilterList.map((attributeFilter) => {
        return `(
  ${attributeFilter}
)`;
      }).join(' and ');
    }
  }

  showAttributeFilterEditDialog() {

    // compute the current attributeFilter as a AND-combination of the selected attributes
    this.combinedAttributeFilters = this.combineSelectedAttributeFilters();

    this.ngZone.runOutsideAngular(() => {
      $('#attributes-editor').modal({
        inverted: true,
        duration: 200,
        dimmerSettings: {
          useCSS: true
        },
        // observeChanges: true,
        // white background will be set on the 'context'-Element
        context: 'div#attributes-editor-dimmer',
        // context: 'body',
        // detachable: 'true' will move the modal-element inside the context element dom for the modal content stays inside the component when detachable=false otherwise it would be moved to the
        detachable: true
      }).modal('show');
    });
  }

  setCustomFilter(options: { title: string, definition: string }) {
    this.useCustomFilter.set(true);
    this.customFilterTitle = options.title;
    this.customFilterDefinition = options.definition;
  }

}
