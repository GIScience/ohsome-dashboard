import {Observable} from 'rxjs';
import {OhsomeApiV2Service} from '../ohsome-api-v2.service';
import {Type} from '@angular/core';
import Papa, {UnparseConfig} from "papaparse";
import {PlotlyChartComponent} from '../../shared/components/plotly-chart/plotly-chart.component';
import Utils from '../../../utils';
import {toPolygonFeatures, unionPolygonFeatures} from '../../shared/utils/boundaries.utils';
import {Feature, MultiPolygon, Polygon} from 'geojson';
import type {components, paths} from '../../shared/ohsome-api-v2-types';


export interface QueryHandler<TResponse> {
  matches: (formValues: FormValues) => boolean;

  component: Type<unknown>

  execute(formValues: FormValues, api: any, aoiPolygons: Feature<Polygon | MultiPolygon>[]): Observable<TResponse>

  toInputs(response: TResponse, formValues: FormValues): Record<string, unknown>;

  toCSV(response: TResponse): string;

  toBoundaryLabel(formValues: FormValues, aoiPolygons: Feature<Polygon | MultiPolygon>[]): string;

}

interface FormValues {
  filter: string;
  measure: paths['/features/{measure}.json']['post']['parameters']['path']['measure'];
  groupBy: string;
  time: string;
  bpolys?: string;
  bbox?: string;
}

export const timeSeriesHandler: QueryHandler<any> = {

  matches(formValues: FormValues): boolean {
    return ["none", undefined].includes(formValues.groupBy);
  },

  component: PlotlyChartComponent,

  execute(formValues: FormValues, api: OhsomeApiV2Service, aoiPolygons: Feature<Polygon | MultiPolygon>[]): Observable<any> {
    let [start, end, interval] = formValues.time.split("/");
    // handle null, undefined and empty string
    start = start.trim() ? start : "earliest";

    const aoi = unionPolygonFeatures(toPolygonFeatures(formValues)).geometry as components["schemas"]["Polygon"] | components["schemas"]["MultiPolygon"];

    const body: paths['/features/{measure}.json']['post']['requestBody']['content']['application/json'] = {
      filter: formValues.filter,
      timeSeries: {
        start,
        end,
        interval
      },
      aoi: aoi
    }

    return api.features(formValues.measure, body);
  },

  toInputs(response, formValues) {

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

  toBoundaryLabel(formValues: FormValues, aoiPolygons: Feature<Polygon | MultiPolygon>[]): string {
    return String(unionPolygonFeatures(aoiPolygons).id)
  }

}
