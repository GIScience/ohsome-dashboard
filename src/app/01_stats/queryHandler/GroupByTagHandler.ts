import {Observable} from 'rxjs';
import {FeaturesResponse, OhsomeApiV2Service} from '../../ohsomeapi/ohsome-api-v2.service';
import Papa, {UnparseConfig} from "papaparse";
import {PlotlyChartComponent} from '../../shared/components/plotly-chart/plotly-chart.component';
import Utils from '../../../utils';
import {toPolygonFeatures, unionPolygonFeatures} from '../../shared/utils/boundaries.utils';
import {Feature, MultiPolygon, Polygon} from 'geojson';
import type {components, paths} from '../../shared/ohsome-api-v2-types';
import {PlotData, PlotlyDataLayoutConfig} from 'plotly.js-dist-min';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';
import {getFilterFromFormValues} from '../../shared/utils/form.utils';
import {QueryHandler, StatsFormValues} from './TimeSeriesHandler';

type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };

export const groupByTagHandler: QueryHandler<FeaturesResponse> = {

  matches(formValues: StatsFormValues): boolean {
    console.log("GROUPBY", formValues.groupByTagKey);
    return !!formValues.groupByTagKey;
  },

  component: PlotlyChartComponent,

  execute(formValues: StatsFormValues, api: OhsomeApiV2Service, oqtApiMetadataProviderService: OqtApiMetadataProviderService): Observable<any> {

    const start = formValues?.start?.trim() ? formValues.start : "earliest";

    const aoi = unionPolygonFeatures(toPolygonFeatures(formValues)).geometry as components["schemas"]["Polygon"] | components["schemas"]["MultiPolygon"];

    const filter = getFilterFromFormValues(formValues, oqtApiMetadataProviderService);

    const groupBy: components["schemas"]["GroupByTagModel"] = {type:'byTag', key: formValues.groupByTagKey};

    const body: paths['/stats/features/{measure}.json']['post']['requestBody']['content']['application/json'] = {
      filter,
      timeSeries: {
        start,
        end: formValues.end,
        interval: formValues.interval
      },
      aoi,
      groupBy
    }

    return api.features(formValues.measure, body);
  },

  toInputs(response: FeaturesResponse, formValues): {plotlyDataLayoutConfig: PlotlyDataLayoutConfig} {

    const groupByResult = response.result as NoUndefinedField<components['schemas']['SnapshotColumnsGrouped']>

    let yAxisText = Utils.capitalizeFirstLetter(`${formValues.measure}`);
    const unit = Utils.getUnitByMeasure(formValues.measure).trim()
    const hasUnit = !!unit;
    if (hasUnit) yAxisText += ` [${unit}]`

    const x = groupByResult.timestamp;
    const length = x.length;

    const traces: Partial<PlotData>[] = Object.entries(groupByResult.values).map(([key, value]):Partial<PlotData> => {
      return {
        x,
        y: value as number[],
        name: key,
        stackgroup: 'one',
        mode: 'none'
      }
      // @ts-ignore
    }).sort((traceA, traceB) => traceB.y[length-1] - traceA.y[length-1]);
    traces.push({
      x,
      y: response.result.value,
      name: `Total ${yAxisText}`,
      mode: 'lines',
      line: { color: '#2185D0', width: 2 }
    })

    return {
      "plotlyDataLayoutConfig": {
        data: traces,
        layout: {
          hovermode: 'x unified',
          xaxis: {
            showspikes: true,            // Enable the spike line
            spikemode: 'across+marker',  // Draw across plot area AND show target marker
            spikesnap: 'hovered data',         // Snap the line directly to your mouse pointer
            spikethickness: 1,           // Width of the line in pixels
            spikecolor: '#ff0000',       // Color of the line
            spikedash: 'dash',
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
