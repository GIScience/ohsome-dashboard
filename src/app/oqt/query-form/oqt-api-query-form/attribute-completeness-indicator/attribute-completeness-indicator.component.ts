import {
  AfterContentInit,
  Component, EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import {SimpleIndicatorComponent} from '../simple-indicator/simple-indicator.component';
import {ControlContainer, NgForm} from '@angular/forms';
import {OqtApiMetadataProviderService} from '../../../oqt-api-metadata-provider.service';
import {AttributeResponseJSON, Indicator, OqtAttribute} from '../../../types/types';
import {KeyValue} from '@angular/common';

declare const $;

@Component({
  selector: 'app-attribute-completeness-indicator',
  templateUrl: './attribute-completeness-indicator.component.html',
  styleUrl: './attribute-completeness-indicator.component.css',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
})
export class AttributeCompletenessIndicatorComponent extends SimpleIndicatorComponent /*implements OnInit, AfterContentInit, OnChanges*/ {
  @Input() topicName!: string;
  @Input() selectedTopicKey!: string;
  @Input() hashParams!: URLSearchParams;
  @Output() override indicatorToggle: EventEmitter<{indicator: Indicator, state: boolean}> = new EventEmitter<{indicator: Indicator, state: boolean}>();
  private oqtApiMetadataProviderService: OqtApiMetadataProviderService;
  protected attributes: Record<string, Record<string, OqtAttribute>>;
  protected selectedAttributeKeys: string[];

  constructor(oqtApiMetadataProviderService: OqtApiMetadataProviderService) {
    super();
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

    // initialize the indicator search dropdown on toggle checkbox to true
    this.indicatorToggle.subscribe(
      (event)=>{
        console.log("Attribute TOGGLE all");
        if (event.state) {
          console.log("Attribute TOGGLE true")
          this.initAttributeDropdown();
        }
      }
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    const topicChange: SimpleChange = changes['selectedTopicKey'];
    if (topicChange && !topicChange.firstChange) {

      //sanitize attributes
      $('#search-select-attribute').dropdown('clear')
      this.selectedAttributeKeys = this.sanitizeAttributeKeys(this.selectedAttributeKeys);
      this.initAttributeDropdown()
      //$('#search-select-attribute').dropdown('set exactly', this.selectedAttributeKeys);
    }
  }

  initAttributeDropdown() {
    setTimeout(() => {
      $('#search-select-attribute').dropdown({
        fullTextSearch: 'exact'
      });

      // $('#search-select-attribute').dropdown('set exactly', ['maxspeed']);

      // $('.ui.dropdown2').dropdown('set exactly', this.selectedAttributeKey);

      // $('.ui.dropdown2').dropdown('set exactly', this.indicator.params[`${this.indicator.key}--attributes`]);
    }, 100);
  }

  getAttributeKeysFromUrlHashParams(hashParams): string[]{

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

  private sanitizeAttributeKeys( attributeKeyCandidates: string[]) {
    let attributeKeys:string[] = [];

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

  getDefaultAttributeKey(topicKey): string {
    return (this.topicHasAttributes(topicKey))? Object.keys(this.attributes[topicKey])[0] : '';
  }


  /// TODO now we always have a current AttributeList
  getNameOfCurrentAttribute(pair: KeyValue<string, OqtAttribute>) {
    return pair.value.name
  }

  getKeyOfCurrentAttribute(pair: KeyValue<string, OqtAttribute>) {
    return pair.key
  }

  getEntriesForSelectedTopicKey(): Record<string, OqtAttribute> {
    if (this.attributes[this.selectedTopicKey] !== undefined) {
      return this.attributes[this.selectedTopicKey]
    } else {
      return {}
    }
  }

}
