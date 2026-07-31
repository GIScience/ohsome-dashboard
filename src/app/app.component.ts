import {AfterViewInit, ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {OhsomeApiMetadataProviderService} from './ohsomeapi/ohsome-api-metadata-provider.service';
import packageJson from '../../package.json';
import {OqtApiMetadataProviderService} from './oqapi/oqt-api-metadata-provider.service';
import {UrlHashParamsProviderService} from './singelton-services/url-hash-params-provider.service';
import {StateService} from './singelton-services/state.service';
import {JsonPipe, NgClass} from '@angular/common';
import {QueryPanelComponent} from './query-panel/query-panel.component';
import {ResultPanelComponent} from './result-panel/result-panel.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {ExtractionQueryFormComponent} from './extraction/query-form/extraction-query-form.component';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, QueryPanelComponent, ResultPanelComponent, WelcomeComponent, ExtractionQueryFormComponent, JsonPipe]
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

  protected readonly environment = environment;
}
