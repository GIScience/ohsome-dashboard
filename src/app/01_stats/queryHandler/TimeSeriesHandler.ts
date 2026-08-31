import {Observable} from 'rxjs';
import {FeaturesRequestBody, FeaturesResponse, OhsomeApiV2Service} from '../../ohsomeapi/ohsome-api-v2.service';
import {Type} from '@angular/core';
import Papa, {UnparseConfig} from "papaparse";
import {PlotlyChartComponent} from '../../shared/components/plotly-chart/plotly-chart.component';
import Utils from '../../../utils';
import {unionFeatureDisplayNames, unionPolygonFeatures} from '../../shared/utils/boundaries.utils';
import {Feature, GeoJsonProperties, MultiPolygon, Polygon} from 'geojson';
import type {components, paths} from '../../ohsomeapi/ohsome-api-v2-types';
import {PlotlyDataLayoutConfig} from 'plotly.js-dist-min';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';
import {getFilterFromFormValues} from '../../shared/utils/form.utils';
import {getCSVHeader} from '../result/result.utils';


export interface QueryHandler<TResponse> {
  matches: (formValues: StatsFormValues) => boolean;

  component: Type<unknown>

  execute(formValues: StatsFormValues, aoiPolygons: Feature<Polygon | MultiPolygon, GeoJsonProperties>[], api: any, oqtApiMetadataProviderService: OqtApiMetadataProviderService): Observable<TResponse>

  toInputs(response: TResponse, formValues: StatsFormValues): Record<string, unknown>;

  toCSV(response: TResponse): string;

  toBoundaryLabel(formValues: StatsFormValues, aoiPolygons: Feature<Polygon | MultiPolygon>[]): string;

}


//TODO check if this is needed or can we use StatsFormData?
export interface StatsFormValues {
  filter: string;
  measure: paths['/stats/features/{measure}.json']['post']['parameters']['path']['measure'];
  groupByTagKey: string;
  start: string;
  end: string;
  interval: string;
  bpolys?: string;
  bbox?: string;
}

export const timeSeriesHandler: QueryHandler<FeaturesResponse> = {

  matches(formValues: StatsFormValues): boolean {
    console.log("GROUPBY", formValues);
    return !formValues.groupByTagKey;
  },

  component: PlotlyChartComponent,

  execute(formValues: StatsFormValues, aoiPolygons: Feature<Polygon | MultiPolygon>[], api: OhsomeApiV2Service, oqtApiMetadataProviderService: OqtApiMetadataProviderService): Observable<FeaturesResponse> {

    const start = formValues?.start?.trim() ? formValues.start : "earliest";

    const aoi = unionPolygonFeatures(aoiPolygons).geometry as components["schemas"]["Polygon"] | components["schemas"]["MultiPolygon"];

    const filter = getFilterFromFormValues(formValues, oqtApiMetadataProviderService);

    const body: FeaturesRequestBody = {
      filter: filter,
      timeSeries: {
        start,
        end: formValues.end,
        interval: formValues.interval
      },
      aoi: aoi
    }

    return api.features(formValues.measure, body);
  },

  toInputs(response: FeaturesResponse, formValues): { plotlyDataLayoutConfig: PlotlyDataLayoutConfig } {

    let yAxisText = Utils.capitalizeFirstLetter(`${formValues.measure}`);
    const unit = Utils.getUnitByMeasure(formValues.measure).trim()
    const hasUnit = !!unit;
    if (hasUnit) yAxisText += ` [${unit}]`

    return {
      "plotlyDataLayoutConfig": {
        data: [
          {
            x: response.result.timestamp,
            y: response.result.value
          }
        ],
        layout: {
          hovermode: 'x',
          xaxis: {
            showspikes: true,            // Enable the spike line
            spikemode: 'across+marker',  // Draw across plot area AND show target marker
            spikesnap: 'data',         // Snap the line directly to your mouse pointer
            spikethickness: 1,           // Width of the line in pixels
            spikecolor: '#ff0000',       // Color of the line
            spikedash: 'dash'
          },
          yaxis: {
            title: {
              text: yAxisText
            },

          }
        }
      }
    }
  },
// add layout and config props

  toCSV(response: FeaturesResponse): string {

    const rows = response.result.timestamp.map((ts, i) => [ts, response.result.value[i]])

    const data = {
      fields: ["timestamp", "value"],
      data: rows
    }

    const unparseConfig: UnparseConfig = {
      delimiter: ";"
    }
    return getCSVHeader(response.apiVersion, response.attribution) + Papa.unparse(data, unparseConfig);
  },

  toBoundaryLabel(formValues: StatsFormValues, aoiPolygons: Feature<Polygon | MultiPolygon, {
    id: any,
    display_name: string
  }>[]): string {
    return unionFeatureDisplayNames(aoiPolygons);
  }

}
