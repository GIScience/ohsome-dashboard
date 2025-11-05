import {
  afterNextRender,
  afterRenderEffect,
  Component,
  inject,
  NgZone,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
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

  private readonly ngZone = inject(NgZone);
  protected stateService = inject(StateService);
  protected urlHashParamsService = inject(UrlHashParamsProviderService);
  protected oqtApiMetadataProviderService= inject(OqtApiMetadataProviderService);

  private readonly oqtApiMetadata: MetadataResponseJSON = this.oqtApiMetadataProviderService.getOqtApiMetadata();
  private tabContentElementsHeight: any;

  @ViewChild('welcome') welcomeElement;


  constructor() {

    let welcomeElementJq;
    let tabMenuElements;


    // runs once like AfterViewInit
    afterNextRender(()=>{

      welcomeElementJq = $(this.welcomeElement.nativeElement);
      tabMenuElements= welcomeElementJq.find('.tabular.menu .item');

  ngAfterViewInit(): void {
    $('#welcome').modal({
      inverted: true,
      duration: 200,
      // white background will be attached to context
      context: 'div#welcome-dimmer',
      // modal DOM Element will be moved into context
      detachable: true
    }).modal('show');

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
        },
        onVisible: () => {
          tabMenuElements.tab("change tab", this.stateService.appState().welcomeTab);
        }
      });

      // initialize tabs
      Tabulator.registerModule([FormatModule, FrozenColumnsModule, SortModule, FilterModule, EditModule, SelectRowModule, InteractionModule]);

      tabMenuElements.tab({
        onVisible: (tabPath) => {
          this.stateService.updatePartialState({welcomeTab: tabPath});
          if (tabPath === "topicCatalog") {
            this.tabContentElementsHeight = $('#welcome .tab.segment.active').height() - 30;
            this.createTopicIndicatorMatrix();
            setTimeout(() => {
              document.querySelector<HTMLInputElement>("#welcome div[tabulator-field='topic'] input[type='search']")?.focus();
            })
          }
        }
      });
    })

    // runs every time a signal changes
    afterRenderEffect({
     mixedReadWrite: ()=>{

       //signal that trigger this function
       const showWelcomeScreen = this.stateService.appState().showWelcomeScreen;


        if (showWelcomeScreen) {
          welcomeElementJq.modal('show');
        } else {
          welcomeElementJq.modal('hide');
        }





      }
    })
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
