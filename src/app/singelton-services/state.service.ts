import {computed, effect, Service, signal} from '@angular/core';
import {isQueryMode, QueryMode} from '../shared/shared-types';
import equal from 'fast-deep-equal/es6';
import {ExtractionFormData, QualityFormData, StatsFormData} from '../03_extraction/query-form/types';
import Utils from '../../utils';
import {ExtractionQueryFormComponent} from '../03_extraction/query-form/extraction-query-form.component';
import {linkField} from '../shared/utils/form.utils';
import {StatsQueryFormComponent} from '../01_stats/query-form/stats-query-form.component';

interface PermalinkDialogState {
  open: boolean;
  permalink: string | null;
}

interface StateParams {
  showWelcomeScreen: boolean;
  welcomeTab: string;
  firstForm: boolean;
  appLanguage: string;
  queryMode: QueryMode;
  permalinkDialog: PermalinkDialogState;
}

@Service()
export class StateService {
  initialHashParams = StateService.getInitialHashParams();

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
  isValidCurrentForm = computed<boolean>(() => {
    const isValidStatsForm = this.isValidStatsForm();
    const isValidExtractionForm = this.isValidExtractionForm();
    switch (this.queryModeSignal()) {
      case 'ohsomeApi':
        return isValidStatsForm;
      case 'extraction':
        return isValidExtractionForm;
      default:
        return true;
    }
    // return (this.queryModeSignal() === 'ohsomeApi') ? isValidStatsForm : isValidExtractionForm;
  })


  private readonly initialState: StateParams = {
    showWelcomeScreen: this.initialHashParams.size === 0,
    welcomeTab: 'intro',
    firstForm: true,
    appLanguage: 'en',
    queryMode: StateService.getInitialQueryMode(this.initialHashParams),
    permalinkDialog: {open: false, permalink: null}
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

  // Public readonly signal for components to read
  public readonly appState = this._appState.asReadonly();

  public queryModeSignal = computed(() => this.appState().queryMode);
  readonly permalinkDialog = computed(() => this._appState().permalinkDialog);

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

  static getInitialHashParams(): URLSearchParams {
    const initialHashParams = new URLSearchParams(globalThis.location.hash.slice(1));

    //support legacy permalinks (e.g. from taginfo
    //if backend=ohsomeApi key value types --> transform to custom topic
    const hasLegacyParams = initialHashParams.has('backend', 'ohsomeApi')
      && initialHashParams.has('key')
      && initialHashParams.has('value');

    if (hasLegacyParams) {
      const isNotEmptyKey = !!initialHashParams.get('key');
      if (!isNotEmptyKey) return initialHashParams;

      const key = initialHashParams.get('key')!;
      const value = initialHashParams.get('value') || '*';
      const isNotEmptyTypes = !!initialHashParams.get('types');
      const types = (initialHashParams.get('types') || '').split(',');
      const typeFilter = types.map(t => {
        return `type:${t}`
      }).join(' or ');
      const topicFilterParts = [`${key}=${value}`];
      if (isNotEmptyTypes) topicFilterParts.push(`(${typeFilter})`);
      const topicFilter = topicFilterParts.join(' and ');

      initialHashParams.delete('key');
      initialHashParams.delete('value');
      initialHashParams.delete('types');

      initialHashParams.set('topic', 'custom-topic');
      initialHashParams.set('topic-title', `${key}=${value}`);
      initialHashParams.set('topic-filter', `${topicFilter}`);
    }

    return initialHashParams;
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

  openPermalinkDialog(permalink: string): void {
    this.updatePartialState({
      permalinkDialog: {open: true, permalink}
    });
  }

  closePermalinkDialog(): void {
    this.updatePartialState({
      permalinkDialog: {open: false, permalink: null}
    });
  }


}
