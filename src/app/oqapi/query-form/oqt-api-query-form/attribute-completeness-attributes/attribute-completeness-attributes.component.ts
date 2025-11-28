import { Component, effect, ElementRef, Input, NgZone, OnChanges, OnInit, signal, SimpleChange, SimpleChanges, ViewChild, viewChild, inject } from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {OqtApiMetadataProviderService} from '../../../oqt-api-metadata-provider.service';
import {OqtAttribute, Topic} from '../../../types/types';


declare const $, Prism;

@Component({
    selector: 'app-attribute-completeness-attributes',
    templateUrl: './attribute-completeness-attributes.component.html',
    styleUrl: './attribute-completeness-attributes.component.css',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    standalone: false
})
export class AttributeCompletenessAttributesComponent implements OnInit, OnChanges {
  ngZone = inject(NgZone);
  oqtApiMetadataProviderService = inject(OqtApiMetadataProviderService);

  @Input({required: true}) selectedTopic!: Topic;
  @Input() hashParams!: URLSearchParams;
  @Input({required: true}) indicatorKey!: string;

  @ViewChild('attributeFilter', {static: false}) preElem: ElementRef<HTMLPreElement>;

  customAttributeLabelElement = viewChild<ElementRef<HTMLDivElement>>('customAttributeLabelElement')

  attributes: Record<string, Record<string, OqtAttribute>>;
  selectedAttributeKeys: string[];

  combinedAttributeFilters: string;

  // used to define wether to display dropdown with predefined attributes (false) or display the  user defined custom attribute
  useCustomFilterMode = signal(false);
  customFilterTitle = signal<string>('');
  customFilterDefinition = signal<string>('');

  constructor() {
    // update popup content whenever the signal customFilterDefinition changes
    effect(() => {
      $(this.customAttributeLabelElement()?.nativeElement).popup({
        content: this.customFilterDefinition(),
        variation: 'inverted'
      })
    });
  }

  ngOnInit(): void {

    this.attributes = this.oqtApiMetadataProviderService.getAttributes().result;

    // determine useCustomFilterMode
    this.useCustomFilterMode.set(this.hasCustomFilterModeParams());

    //extract and sanitize selectedAttributeKeys
    this.selectedAttributeKeys = this.getAttributeKeysFromUrlHashParams(this.hashParams);

    //extract customFilter
    if (this.useCustomFilterMode()) {
      this.customFilterTitle.set(this.hashParams.get('attribute-completeness--attribute-title') ?? '');
      this.customFilterDefinition.set(this.hashParams.get('attribute-completeness--attribute-filter') ?? '');
    }

  }

  ngOnChanges(changes: SimpleChanges): void {

    const topicChange: SimpleChange = changes['selectedTopic'];

    if (topicChange && !topicChange.firstChange) {
      this.selectedAttributeKeys = this.sanitizeAttributeKeys(this.selectedAttributeKeys);
      this.useCustomFilterMode.set(false);
    }
  }

  onLabelCreate(attributeKey: string, text: string) {
    const attributeFilter = this.oqtApiMetadataProviderService.getAttributeFilter(this.selectedTopic.key, attributeKey);

    return $(`<a class="ui label">${text}<i class="delete icon"></i></a>`)
      .attr('data-value', attributeKey)
      // click for modal with detailed attribute description
      .on('click', {attributeKey}, this.showAttributeDetails.bind(this))
      // hover for small popup with filter definition
      .popup({
          content: attributeFilter,
          variation: 'inverted'
        }
      );
  }

  attributesDropdownOptions = {
    fullTextSearch: 'exact',
    clearable: true,
    // custom attribute labels for selected items with mouse events
    onLabelCreate: this.onLabelCreate.bind(this),
  }


  showAttributeDetails(event) {
    // don't trigger modal if user clicks on close icon (X), only when directly clicked in the attribute label
    if (event.target != event.currentTarget) {
      return;
    }


    const attributeKey = event.data["attributeKey"] as string;
    const attribute = this.attributes[this.selectedTopic.key][attributeKey];

    const highlightedHTML = Prism.highlight(attribute.filter, Prism.languages['ohsome-filter'], 'ohsome-filter');

    // set content for the modal window with attribute metadata
    $('#attribute-details #title')
      .html(`<span class="ui circular label">${this.selectedTopic.name}</span><br>${attribute.name}`);
    // $('#attribute-details #description')
    //   .html(attribute.description);
    $('#attribute-details #attributeFilter')
      .html(highlightedHTML);

    $('#attribute-details').modal({
      inverted: true,
      duration: 200,
      // white background will be attached to context
      context: 'div#attributes-details-dimmer',
      // modal DOM Element will be moved into context
      detachable: true
    }).modal('show');
  }

  hasCustomFilterModeParams(): boolean {
    return this.hashParams.has('attribute-completeness--attribute-title') &&
      this.hashParams.has('attribute-completeness--attribute-filter');
  }

  getAttributeKeysFromUrlHashParams(hashParams: URLSearchParams): string[] {

    // 1. extract the attributes from URL
    //  might be null, empty or a single string
    //  the single string might contain one or multiple attributeKeys seperated by "," (comma)
    const attributesFromUrl: string[] | undefined = hashParams.get('attribute-completeness--attributes')?.split(',').filter((ele) => ele.trim() !== '');

    // 2.undefined should return the defaultAttributeKey
    // this can happen when the URL specifies indicator=attribute-completeness but NOT attribute-completeness-attributes
    if (attributesFromUrl == undefined) {
      return [this.getDefaultAttributeKey(this.selectedTopic.key)];
    }
    // 3. convert to an array with one or more elements, an element can only be an empty string if there is no defaultAttribute
    return this.sanitizeAttributeKeys(attributesFromUrl);
  }

  sanitizeAttributeKeys(attributeKeyCandidates: string[]) {
    let attributeKeys: string[];

    //  1. only keep attributes that are valid for the current topic
    attributeKeys = attributeKeyCandidates.filter((attributeKeyCandidate) => {
      return this.isValidAttributeKey(this.selectedTopic.key, attributeKeyCandidate);
    });

    // 2. set default
    //  if after the conversion only an empty array exists set the first available attribute for the topic
    if (attributeKeys.length === 0) {
      attributeKeys = [this.getDefaultAttributeKey(this.selectedTopic.key)];
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

  combineSelectedAttributes(): { combinedNames: string, combinedFilters: string } {

    // get a valid attributeFilter list
    // can have 0...n filter elements
    const attributeList: {
      combinedNames: string,
      combinedFilters: string
    }[] = this.selectedAttributeKeys.flatMap((attributeKey) => {
      const filter = this.oqtApiMetadataProviderService.getAttributeFilter(this.selectedTopic.key, attributeKey);
      const name = this.oqtApiMetadataProviderService.getAttributeName(this.selectedTopic.key, attributeKey);
      return name != undefined && filter != undefined ? [{combinedNames: name, combinedFilters: filter}] : [];
    });

    switch (attributeList.length) {
      case 0: {
        return {combinedNames: '', combinedFilters: ''};
      }
      case 1: {
        return attributeList[0];
      }
      default: {
        return {combinedNames: concatNames(), combinedFilters: concatFilters()};
      }
    }

    function concatNames(): string {
      const allButLastAttributes = attributeList.slice(0, -1);
      const lastAttribute = attributeList[attributeList.length - 1];
      return allButLastAttributes.map(combinedAttribute => {
        return combinedAttribute.combinedNames
      }).join(', ') + ' and ' + lastAttribute.combinedNames;

    }

    // surround filters with brackets and concat them with ' and ' and add pretty linebreaks
    function concatFilters() {
      return attributeList.map((combinedAttribute) => {
        return `(
  ${combinedAttribute.combinedFilters}
)`;
      }).join(' and ');
    }
  }

  showAttributeFilterEditDialog() {

    // compute the current attributeFilter as an AND-combination of the selected attributes
    if (!this.useCustomFilterMode()) {
      const {combinedNames, combinedFilters} = this.combineSelectedAttributes();
      this.customFilterTitle.set(combinedNames)
      this.customFilterDefinition.set(combinedFilters);
    }

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

    $('.ui.accordion')
      .accordion()
    ;
  }

  setCustomFilerTitle($event: Event) {
    this.customFilterTitle.set(($event.target as HTMLInputElement).value);
  }

  triggerClick(event: Event) {
    $(event.target).trigger('click')
  }
}
