import {computed, effect, Service, signal} from '@angular/core';
import {isQueryMode, QueryMode} from '../shared/shared-types';
import equal from 'fast-deep-equal/es6';
import {ExtractionFormData, QualityFormData} from '../extraction/query-form/types';
import Utils from '../../utils';
import {ExtractionQueryFormComponent} from '../extraction/query-form/extraction-query-form.component';
import {linkField} from '../shared/utils/form.utils';

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

  extractionFormModel = signal<ExtractionFormData>(
    ExtractionQueryFormComponent.buildInitialModel(this.initialHashParams),
    {
      equal: (a, b) => {
        return equal(a, b);
      }
    });

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

  private readonly initialState: StateParams = {
    showWelcomeScreen: false,
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
    console.log(this.sharedFormSignals);
    linkField(this.extractionFormModel, 'topic', this.sharedFormSignals['topic']);
    linkField(this.extractionFormModel, 'topic-title', this.sharedFormSignals['topic-title']);
    linkField(this.extractionFormModel, 'topic-filter', this.sharedFormSignals['topic-filter']);
    linkField(this.qualityFormModel, 'topic', this.sharedFormSignals['topic']);
    linkField(this.qualityFormModel, 'topic-title', this.sharedFormSignals['topic-title']);
    linkField(this.qualityFormModel, 'topic-filter', this.sharedFormSignals['topic-filter']);


    // Do not create a dependency in UrlHashParamsProviderService
    // const initialHashParams = new URLSearchParams(globalThis.location.hash.slice(1));
    // without permalink params, welcomeScreen should be shown
    // this.updatePartialState({showWelcomeScreen: initialHashParams.size === 0});
    //
    // // initialize queryMode (old :backend) to choose form tab
    // // Do not create a dependency in UrlHashParamsProviderService
    // const backendParam = initialHashParams.get('backend');
    // const queryMode = isQueryMode(backendParam) ? backendParam : 'ohsomeApi';
    // this.updatePartialState({queryMode});
    //
    // // initialize shared form fields, other form fields are initialized in their respective component
    // // const initialTopic = isTopic(initialHashParams.get('topic'), this.oqtApiMetadataProviderService);
    // if (initialHashParams.has('topic')) this.sharedFormSignals.topic.set(<string>initialHashParams.get('topic'));
    // if (initialHashParams.has('topic-title')) this.sharedFormSignals.customTopicTitle.set(<string>initialHashParams.get('topic-title'));
    // if (initialHashParams.has('topic-filter')) this.sharedFormSignals.customTopicFilter.set(<string>initialHashParams.get('topic-filter'));

    effect(() => {
      console.log("App state changed", this.appState());
    });
    // effect(() => {
    //   console.log("StateService changes HashParams", this.queryModeSignal())
    //   // TODO handle all url params here (that are not part of the query?)
    //   this.urlHashParamsProviderService.updateHashParam('backend', this.queryModeSignal());
    // })
  }

  init() {
    console.log("init", this.initialHashParams.toString());

    // without permalink params, welcomeScreen should be shown
    this.updatePartialState({showWelcomeScreen: this.initialHashParams.size === 0});

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
