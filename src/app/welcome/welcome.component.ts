import {AfterViewInit, Component, inject, NgZone, ViewEncapsulation} from '@angular/core';
import {
  ColumnDefinition, EditModule,
  FilterModule,
  FormatModule,
  FrozenColumnsModule,
  SortModule,
  Tabulator
} from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
import {OqtApiMetadataProviderService} from '../oqt/oqt-api-metadata-provider.service';
import {MetadataResponseJSON} from '../oqt/types/MetadataResponseJSON';

declare let $;

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements AfterViewInit {
  private readonly oqtApiMetadata: MetadataResponseJSON;

  private readonly ngZone = inject(NgZone);

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
    Tabulator.registerModule([FormatModule, FrozenColumnsModule, SortModule, FilterModule, EditModule]);

    $('.tabular.menu .item').tab({
      onVisible: (tabPath) => {
        if (tabPath === "second") {
          this.createTopicIndicatorMatrix();
          setTimeout(()=>{
            document.querySelector<HTMLInputElement>("div[tabulator-field='topic'] input[type='search']")?.focus();
          }, 300)
        }
      }
    });
  }

  createTopicIndicatorMatrix() {
    this.ngZone.runOutsideAngular(() => {
      const table = new Tabulator("#topicTable", {
        minHeight: 200,
        renderVertical: "basic",
        columns: [{title: "", field: "topic", frozen: true, headerSort: false, headerFilter: 'input', headerFilterFunc: "like"}, ...this.createColumnDefinitions()],
        data: this.createData()
      });
    });
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
          headerSortStartingDir: "desc",
          headerSortTristate: true
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
    }).sort((topicRowA, topicRowB) => {
      //order topic by name
      return topicRowA.topic.localeCompare(topicRowB.topic)
    })

  }
}
