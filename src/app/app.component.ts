import {AfterViewInit, ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {OhsomeApiMetadataProviderService} from './ohsomeapi/ohsome-api-metadata-provider.service';
import packageJson from '../../package.json';
import {OqtApiMetadataProviderService} from './02_quality/oqt-api-metadata-provider.service';
import {UrlHashParamsProviderService} from './singelton-services/url-hash-params-provider.service';
import {StateService} from './singelton-services/state.service';
import {JsonPipe, NgClass} from '@angular/common';
import {QueryPanelComponent} from './query-panel/query-panel.component';
import {ResultPanelComponent} from './result-panel/result-panel.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {AuthService} from './singelton-services/auth.service';
import {environment} from '../environments/environment';
import {CopyPermalinkModalComponent} from './copy-permalink-modal/copy-permalink-modal.component';
import {getLocalizedOqapiDocsUrl} from './shared/shared-types';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, QueryPanelComponent, ResultPanelComponent, WelcomeComponent, CopyPermalinkModalComponent, JsonPipe]
})
export class AppComponent implements AfterViewInit {
  urlHashParamsProviderService = inject(UrlHashParamsProviderService);
  ohsomeApiMetadataProviderService = inject(OhsomeApiMetadataProviderService);
  oqtApiMetadataProviderService = inject(OqtApiMetadataProviderService);
  protected stateService = inject(StateService);
  protected authService = inject(AuthService);

  title = 'ohsome dashboard';
  public hasAnnouncement: boolean;
  public announcement: string;
  public currentYear: string = new Date().getFullYear().toString();
  protected readonly window = window;
  protected readonly frontendVersion: string = packageJson.version;
  protected readonly ohsomeApiVersion: string;
  protected readonly oqtApiVersion: string;
  readonly queryModeSignal = this.stateService.queryModeSignal;


  constructor() {
    console.log("AppComponent constructor");
    this.hasAnnouncement = this.ohsomeApiMetadataProviderService.hasOhsomeApiAnnouncement();
    this.announcement = this.ohsomeApiMetadataProviderService.getOhsomeApiAnnouncement();
    this.ohsomeApiVersion = this.ohsomeApiMetadataProviderService.getOhsomeMetadataResponse()?.apiVersion ?? '';
    this.oqtApiVersion = this.oqtApiMetadataProviderService.getOqtApiMetadata()?.apiVersion ?? '';
  }

  ngAfterViewInit(): void {
    this.handleAnnouncementClose();

    // initialize the language menu
    $('app-root #languageSelector').dropdown({
      selectOnKeydown: false,
      onChange: (language) => this.switchLanguage(language)
    });

    $('app-root #profileSelector').dropdown({
      selectOnKeydown: false,
      action: 'hide'
    });

    $('app-root #docsSelector').dropdown({
      selectOnKeydown: false,
      action: 'hide'
    });

  }

  private handleAnnouncementClose() {
    $('#announcement .message .close')
      .on('click', function () {
        $('#announcement')
          .transition('fade')
        ;
      })
    ;
  }

  switchLanguage(selectedLanguage: string): void {
    localStorage.setItem('locale', selectedLanguage)
    location.href = `../${selectedLanguage}/#${this.urlHashParamsProviderService.getHashURLSearchParams().toString()}`;
  }

  getOqapiDocsUrl(): string {
    return getLocalizedOqapiDocsUrl(environment.oqapiDocsUrl);
  }

  protected readonly environment = environment;
}
