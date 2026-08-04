import {computed, effect, Service, signal} from '@angular/core';
import {isQueryMode, QueryMode} from '../shared/shared-types';
import equal from 'fast-deep-equal/es6';
import {ExtractionFormData, QualityFormData, StatsFormData} from '../03_extraction/query-form/types';
import Utils from '../../utils';
import {ExtractionQueryFormComponent} from '../03_extraction/query-form/extraction-query-form.component';
import {linkField} from '../shared/utils/form.utils';
import {StatsQueryFormComponent} from '../01_stats/query-form/stats-query-form.component';

interface StateParams {
  showWelcomeScreen: boolean;
  welcomeTab: string;
  firstForm: boolean;
  appLanguage: string;
  queryMode: QueryMode;
}

@Service()
export class StateService {
  initialHashParams = new URLSearchParams(globalThis.location.hash.slice(1));

  //shared form signals
  sharedFormSignals = {
    topic: signal<string>(Utils.getFromParamsOrDefault(this.initialHashParams, 'topic', Utils.loadEnv('defaultTopicKey', 'cycleway'))),
    'topic-title': signal(Utils.getFromParamsOrDefault(this.initialHashParams, 'topic-title', '')),
    'topic-filter': signal(Utils.getFromParamsOrDefault(this.initialHashParams, 'topic-filter', '')),
  };


  statsFormModel = signal<StatsFormData>(
    StatsQueryFormComponent.buildInitialModel(this.initialHashParams),
    {
      equal: (a, b) => {
        return equal(a, b);
      }
    });

// todo remove legacy form Model
  legacyFormModel = signal<any | null>(null);

  qualityFormModel = signal<QualityFormData>(
    {
      topic: '',
      "topic-title": '',
      "topic-filter": '',
      "indicators": Utils.getFromParamsOrDefault(this.initialHashParams, 'indicators', ['mapping-saturation']),
      "adminids": Utils.getFromParamsOrDefault(this.initialHashParams, 'adminids', ''),
    },
    {
      equal: (a, b) => {
        return equal(a, b);
      }
    }
  );

  extractionFormModel = signal<ExtractionFormData>(
    ExtractionQueryFormComponent.buildInitialModel(this.initialHashParams),
    {
      equal: (a, b) => {
        return equal(a, b);
      }
    });

  isValidStatsForm = signal<boolean>(false);
  isValidExtractionForm = signal<boolean>(false);
  isValidCurrentForm = computed<boolean>(()=>{
    const isValidStatsForm = this.isValidStatsForm();
    const isValidExtractionForm = this.isValidExtractionForm();
    return (this.queryModeSignal() === 'ohsomeApi')? isValidStatsForm: isValidExtractionForm;
  })


  private readonly initialState: StateParams = {
    showWelcomeScreen: this.initialHashParams.size === 0,
    welcomeTab: 'intro',
    firstForm: true,
    appLanguage: 'en',
    queryMode: StateService.getInitialQueryMode(this.initialHashParams),
  };

  // Private signal to hold the current state
  private readonly _appState = signal<StateParams>(
    this.initialState,
    {
      equal: (a, b) => {
        return equal(a, b);
      }
    }
  );
  //TODO add equality fucntion

  // Public readonly signal for components to read
  public readonly appState = this._appState.asReadonly();

  public queryModeSignal = computed(() => this.appState().queryMode);


  constructor() {
    console.log("StateService constructor");
    linkField(this.statsFormModel, 'topic', this.sharedFormSignals['topic']);
    linkField(this.statsFormModel, 'topic-title', this.sharedFormSignals['topic-title']);
    linkField(this.statsFormModel, 'topic-filter', this.sharedFormSignals['topic-filter']);

    linkField(this.qualityFormModel, 'topic', this.sharedFormSignals['topic']);
    linkField(this.qualityFormModel, 'topic-title', this.sharedFormSignals['topic-title']);
    linkField(this.qualityFormModel, 'topic-filter', this.sharedFormSignals['topic-filter']);

    linkField(this.extractionFormModel, 'topic', this.sharedFormSignals['topic']);
    linkField(this.extractionFormModel, 'topic-title', this.sharedFormSignals['topic-title']);
    linkField(this.extractionFormModel, 'topic-filter', this.sharedFormSignals['topic-filter']);


    effect(() => {
      console.log("App state changed", this.appState());
    });

  }


  static getInitialQueryMode = (initialHashParams: URLSearchParams) => {
    // initialize queryMode (old :backend) to choose form tab
    // Do not create a dependency in UrlHashParamsProviderService
    const backendParam = initialHashParams.get('backend');
    return isQueryMode(backendParam) ? backendParam : 'ohsomeApi';
  }

  updatePartialState(partialState: Partial<StateParams>): void {
    this._appState.update(currentState => ({
      ...currentState,
      ...partialState
    }));
  }


}
