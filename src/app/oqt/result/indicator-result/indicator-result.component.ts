import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import {OqtApiService} from '../../oqt-api.service';
import {IndicatorLabel, IndicatorResponseJSON} from '../../types/types';
import {PlotlyDataLayoutConfig} from 'plotly.js-dist-min';
import {OqtApiMetadataProviderService} from '../../oqt-api-metadata-provider.service';
import Utils from '../../../../utils';
import {ErrorResponseJSON} from '../../types/ErrorResponseJSON';


@Component({
  selector: 'app-indicator-result',
  templateUrl: './indicator-result.component.html',
  styleUrls: ['./indicator-result.component.css']
})
export class IndicatorResultComponent implements OnInit {

  @Input() topicKey: string;
  @Input() indicatorKey: string;
  @Input() bpolys: FeatureCollection<Polygon | MultiPolygon>;// Feature<Polygon | MultiPolygon>;
  @Input() attributeKey: string;

  isLoading = true;

  plotlyDataLayoutConfig: PlotlyDataLayoutConfig | null | undefined;
  label: IndicatorLabel = 'undefined';
  indicatorResultDescription: string;
  error: ErrorResponseJSON | undefined = undefined;

  labelMap: { [K in IndicatorLabel]: string } = {
    green: 'high',
    yellow: 'medium',
    red: 'low',
    'undefined': 'undefined'
  };

  // displayQualityLabel - displayed in the ribbon in the top left corner
  displayQualityLabel: string;
  // display the indicator name on top of all as header
  indicatorName: string;

  constructor(
    private oqtApi: OqtApiService,
    private oqtApiMetadataProviderService: OqtApiMetadataProviderService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getIndicatorResults();
  }

  private getIndicatorResults() {
    const body: {
      topic: string;
      // 'indicator-key': string;
      attribute?: string;
      bpolys: FeatureCollection<Polygon | MultiPolygon>;
    } = {
      topic: this.topicKey,
      // 'indicator-key': this.indicatorKey,
      bpolys: this.bpolys
    };

    if (this.indicatorKey !== "attribute-completeness") {
      delete body.attribute;
    }
    else if (this.attributeKey !== "") {
      body.attribute = this.attributeKey;
    }
    console.log(body)
    if (this.indicatorKey == "attribute-completeness" && this.attributeKey == "") {
      this.isLoading = false;
      this.error = {apiVersion: '1.4.0', type: 'MissingParameterError', detail: [{msg: 'Attribute key is missing. Select an attribute to continue.'}]};
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.oqtApi.getIndicator(this.indicatorKey, body).subscribe({
      next: this.handleResponse.bind(this),
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.error = err.error;
        this.changeDetectorRef.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  private handleResponse(response: IndicatorResponseJSON) {
    const {result, metadata, topic} = response.result[0];
    const {
      figure: rawPlotlyDataLayoutConfig,
      label,
      description
    } = result;

    this.setChartData(rawPlotlyDataLayoutConfig);
    this.label = label;

    if(this.indicatorKey === "attribute-completeness"){
      //TODO attribute param should be included in IndicatorResult metadata
      const attributeName = this.oqtApiMetadataProviderService.getAttributes().result[this.topicKey][this.attributeKey].name;
      this.indicatorName = `${metadata.name}: ${topic.name} having ${attributeName}`
    } else {
      this.indicatorName = metadata.name;
    }

    this.indicatorResultDescription = description;

    this.displayQualityLabel = this.createDisplayQualityLabel();
  }

  public createDisplayQualityLabel(): string {
    const metaDataResult = this.oqtApiMetadataProviderService.getOqtApiMetadata().result;
    const qualityDimensionKey = metaDataResult.indicators[this.indicatorKey]['qualityDimension'];
    const lowerCaseQualityDimensionName = metaDataResult['qualityDimensions'][qualityDimensionKey].name.toLowerCase();
    return `${this.labelMap[this.label]} ${lowerCaseQualityDimensionName}`;
  }


  private setChartData(rawPlotlyDataLayoutConfig: PlotlyDataLayoutConfig | null) {

    if (rawPlotlyDataLayoutConfig == undefined) {
      return;
    }

    // customize chart properties

    // make chart responsive
    Utils.setObjectProperty(rawPlotlyDataLayoutConfig, 'config.responsive', true);
    Utils.setObjectProperty(rawPlotlyDataLayoutConfig, 'layout.autosize', true);

    // remove layout title and it's reserved space
    delete rawPlotlyDataLayoutConfig.layout?.title;
    Utils.setObjectProperty(rawPlotlyDataLayoutConfig, 'layout.margin.t', 25);

    // make sure the title of yaxis has enough space
    Utils.setObjectProperty(rawPlotlyDataLayoutConfig, 'layout.yaxis.automargin', true);

    this.plotlyDataLayoutConfig = rawPlotlyDataLayoutConfig;
  }

}
