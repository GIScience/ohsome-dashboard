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
    const body = {
      'topic': this.topicKey,
      // 'indicator-key': this.indicatorKey,
      bpolys: this.bpolys
    };

    this.oqtApi.getIndicator(this.indicatorKey, body).subscribe({
      next: this.handleResponse.bind(this),
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.error = err.error;

      },
      complete: () => {
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  private handleResponse(response: IndicatorResponseJSON) {
    const {result, metadata} = response.result[0];
    const {
      figure: rawPlotlyDataLayoutConfig,
      label,
      description
    } = result;

    this.setChartData(rawPlotlyDataLayoutConfig);
    this.label = label;
    this.indicatorName = metadata.name;
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
