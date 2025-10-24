import {AfterViewInit, Component} from '@angular/core';
import {ColumnDefinition, FormatModule, FrozenColumnsModule, Tabulator} from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
import {OqtApiMetadataProviderService} from '../oqt/oqt-api-metadata-provider.service';
import {MetadataResponseJSON} from '../oqt/types/MetadataResponseJSON';

declare let $;

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements AfterViewInit {
  private readonly oqtApiMetadata: MetadataResponseJSON;

  constructor(oqtApiMetadataProviderService: OqtApiMetadataProviderService) {
    this.oqtApiMetadata = oqtApiMetadataProviderService.getOqtApiMetadata();
  }

  ngAfterViewInit(): void {
    $('#welcome').modal({
      inverted: true,
      duration: 200,
      // white background will be attached to context
      context: 'div#welcome-dimmer',
      // modal DOM Element will be moved into context
      detachable: true
    }).modal('show');

    // initialize tabs
    $('.tabular.menu .item').tab();

    Tabulator.registerModule([FormatModule, FrozenColumnsModule]);
    const table = new Tabulator("#topicTable", {
      minHeight: 200,
      maxHeight: "100%",
      renderVertical:"basic",
      columns: [{title: "", field: "topic", frozen: true}, ...this.createColumnDefinitions()],
      data: this.createData()
    });

    this.createData();
  }

  createColumnDefinitions(): ColumnDefinition[] {
    const qualityDimensions = this.oqtApiMetadata.result.qualityDimensions;
    const indicators = this.oqtApiMetadata.result.indicators;

    const dimensionGroups = Object.groupBy(
      Object.entries(indicators).map(([key, value]) => {
        return {key, ...value}
      }),
      ({qualityDimension}) => {
        return qualityDimension;
      });

    console.log(dimensionGroups);

    const columnsDefintions = Object.entries(dimensionGroups).map(([qualityDimensionKey, indicatorObjList]) => {
      const columnGroup: ColumnDefinition = {title: qualityDimensions[qualityDimensionKey].name};
      columnGroup.columns = indicatorObjList?.map((indicatorObj): ColumnDefinition => {
        return {
          title: indicatorObj.name,
          field: indicatorObj.key,
          formatter: "tickCross",
          formatterParams: {
            allowEmpty: false,
            allowTruthy: true,
          },
          hozAlign: "center",
        }
      });
      return columnGroup;
    });

    console.log(columnsDefintions);
    return columnsDefintions;
  }

  createData() {
    const topics = this.oqtApiMetadata.result.topics;

    return Object.entries(topics).map(([topicKey, topicObj]) => {
      return {
        id: topicKey, topic: topicObj.name, ...topicObj.indicators.reduce((previousValue, currentValue) => {
          return {...previousValue, [currentValue]: true}
        }, {})
      }
    })

  }
}
