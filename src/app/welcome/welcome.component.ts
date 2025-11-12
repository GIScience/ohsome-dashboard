import {
  afterNextRender,
  afterRenderEffect,
  Component,
  computed,
  inject,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  ColumnDefinition,
  EditModule,
  FilterModule,
  FormatModule,
  FrozenColumnsModule,
  InteractionModule,
  RowComponent,
  SelectRowModule,
  SortModule,
  Tabulator
} from 'tabulator-tables';
import {OqtApiMetadataProviderService} from '../oqt/oqt-api-metadata-provider.service';
import {MetadataResponseJSON} from '../oqt/types/MetadataResponseJSON';
import {StateService} from '../singelton-services/state.service';
import {UrlHashParamsProviderService} from '../singelton-services/url-hash-params-provider.service';

declare let $;

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent {

  stateService = inject(StateService);
  protected urlHashParamsService = inject(UrlHashParamsProviderService);
  protected oqtApiMetadataProviderService = inject(OqtApiMetadataProviderService);

  private readonly oqtApiMetadata: MetadataResponseJSON = this.oqtApiMetadataProviderService.getOqtApiMetadata();
  private tabContentElementsHeight: any;
  topicIndicatorMatrix: Tabulator;

  @ViewChild('welcome') welcomeElement;
  showWelcomeScreenSignal = computed(() => this.stateService.appState().showWelcomeScreen);
  welcomeTabSignal = computed(() => this.stateService.appState().welcomeTab);

  constructor() {

    let welcomeElementJq;
    let tabMenuElements;

    // runs once like AfterViewInit
    afterNextRender(() => {

      welcomeElementJq = $(this.welcomeElement.nativeElement);
      tabMenuElements = welcomeElementJq.find('.tabular.menu .item');


      //initialize modal
      welcomeElementJq.modal({
        inverted: true,
        duration: 200,
        // white background will be attached to context
        context: 'div#welcome-dimmer',
        // modal DOM Element will be moved into context
        detachable: true,
        onHidden: () => {
          this.stateService.updatePartialState({showWelcomeScreen: false});
        }
      });

      // initialize tabs
      Tabulator.registerModule([FormatModule, FrozenColumnsModule, SortModule, FilterModule, EditModule, SelectRowModule, InteractionModule]);

      tabMenuElements.tab({
        onVisible: (tabPath) => {
          this.stateService.updatePartialState({welcomeTab: tabPath});
          if (tabPath === "topicCatalog") {
            this.tabContentElementsHeight = $('#welcome #topicTable').height();
            this.topicIndicatorMatrix = this.createTopicIndicatorMatrix();
            setTimeout(() => {
              document.querySelector<HTMLInputElement>("#welcome div[tabulator-field='topic'] input[type='search']")?.focus();
            })
          }
        }
      });
    })

    // runs every time a signal changes
    afterRenderEffect({
      mixedReadWrite: () => {
        //signal that trigger this function
        const showWelcomeScreen = this.showWelcomeScreenSignal();

        if (showWelcomeScreen) {
          welcomeElementJq.modal('show');
        } else {
          welcomeElementJq.modal('hide');
        }
      }
    })

    afterRenderEffect({
      mixedReadWrite: () => {
        const welcomeTab = this.welcomeTabSignal();
        setTimeout(() => {
            $(this.welcomeElement.nativeElement).find('.tabular.menu .item')
              .tab("change tab", welcomeTab);
          }, 250
        )
      }
    })
  }

  createTopicIndicatorMatrix() {

    // this.ngZone.runOutsideAngular(() => {
      const table = new Tabulator("#topicTable", {
        height: this.tabContentElementsHeight,
        renderVertical: "basic",
        layout: 'fitDataFill',
        selectableRows: "highlight",
        columns: [{
          title: "Topic", frozen: true, columns: [{
            title: "",
            field: "topic",
            headerSort: false,
            headerFilter: 'input',
            headerFilterFunc: "like",
          }]
        }, ...this.createColumnDefinitions()],
        data: this.createData()
      });

      table.on("rowClick", this.onTopicCatalogRowClick);
      return table;
    // });


  }

  onTopicCatalogRowClick = (e: UIEvent, row: RowComponent) => {
    const d = row.getData();
    const currentBackend = this.urlHashParamsService.getHashURLSearchParams().get('backend');
    if (currentBackend === 'oqtApi') {
      this.urlHashParamsService.updateHashParams({backend: 'oqtApi', topic: d['id']});
    } else {
      this.urlHashParamsService.setHashParams({backend: 'oqtApi', topic: d['id']});
    }
    $('#welcome').modal('hide');
  };


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

  linkTo(backend: 'ohsomeApi' | 'oqtApi') {
    this.urlHashParamsService.setHashParams({backend: backend});
    $('#welcome').modal('hide');
  }
}
