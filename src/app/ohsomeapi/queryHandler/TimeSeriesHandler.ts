import {Observable} from 'rxjs';
import {OhsomeApiV2Service} from '../ohsome-api-v2.service';
import {Type} from '@angular/core';
import Papa, {UnparseConfig} from "papaparse";
import {PlotlyChartComponent} from '../../shared/components/plotly-chart/plotly-chart.component';
import Utils from '../../../utils';
import {toPolygonFeatures, unionPolygonFeatures} from '../../shared/utils/boundaries.utils';
import {Feature, MultiPolygon, Polygon} from 'geojson';
import type {components, paths} from '../../shared/ohsome-api-v2-types';
import {PlotlyDataLayoutConfig} from 'plotly.js-dist-min';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';
import {getFilterFromFormValues} from '../../shared/utils/form.utils';


export interface QueryHandler<TResponse> {
  matches: (formValues: StatsFormValues) => boolean;

  component: Type<unknown>

  execute(formValues: StatsFormValues, api: any, oqtApiMetadataProviderService: OqtApiMetadataProviderService, aoiPolygons: Feature<Polygon | MultiPolygon>[]): Observable<TResponse>

  toInputs(response: TResponse, formValues: StatsFormValues): Record<string, unknown>;

  toCSV(response: TResponse): string;

  toBoundaryLabel(formValues: StatsFormValues, aoiPolygons: Feature<Polygon | MultiPolygon>[]): string;

}

interface StatsFormValues {
  filter: string;
  measure: paths['/stats/features/{measure}.json']['post']['parameters']['path']['measure'];
  groupBy: string;
  start: string;
  end: string;
  interval: string;
  bpolys?: string;
  bbox?: string;
}

export const timeSeriesHandler: QueryHandler<any> = {

  matches(formValues: StatsFormValues): boolean {
    return ["none", undefined].includes(formValues.groupBy);
  },

  component: PlotlyChartComponent,

  execute(formValues: StatsFormValues, api: OhsomeApiV2Service, oqtApiMetadataProviderService: OqtApiMetadataProviderService): Observable<any> {
    // let [start, end, interval] = formValues;
    // handle null, undefined and empty string
    const start = formValues?.start?.trim() ? formValues.start : "earliest";

    const aoi = unionPolygonFeatures(toPolygonFeatures(formValues)).geometry as components["schemas"]["Polygon"] | components["schemas"]["MultiPolygon"];

    const filter = getFilterFromFormValues(formValues, oqtApiMetadataProviderService);

    const body: paths['/stats/features/{measure}.json']['post']['requestBody']['content']['application/json'] = {
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

  toInputs(response, formValues): {plotlyDataLayoutConfig: PlotlyDataLayoutConfig} {

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

  toCSV(response: any): string {

    const rows = response.result.timestamp.map((ts, i) => [ts, response.result.value[i]])

    const data = {
      fields: ["timestamp", "value"],
      data: rows
    }

    const unparseConfig: UnparseConfig = {
      delimiter: ";"
    }
    return Papa.unparse(data, unparseConfig);
  },

  toBoundaryLabel(formValues: StatsFormValues, aoiPolygons: Feature<Polygon | MultiPolygon>[]): string {
    return String(unionPolygonFeatures(aoiPolygons).properties["display_name"])
  }

}
