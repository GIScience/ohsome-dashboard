import {AfterViewInit, Component, inject} from '@angular/core';
import {OhsomeApiMetadataProviderService} from './oshdb/ohsome-api-metadata-provider.service';
import packageJson from '../../package.json';
import {OqtApiMetadataProviderService} from './oqt/oqt-api-metadata-provider.service';
import {UrlHashParamsProviderService} from './singelton-services/url-hash-params-provider.service';
import {StateService} from './singelton-services/state.service';


declare let $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements AfterViewInit {
  urlHashParamsProviderService = inject(UrlHashParamsProviderService);

  title = 'ohsome dashboard';
  public hasAnnouncement: boolean;
  public announcement: string;
  public currentYear: string = new Date().getFullYear().toString();
  protected readonly window = window;
  protected readonly frontendVersion: string = packageJson.version;
  protected readonly ohsomeApiVersion: string;
  protected readonly oqtApiVersion: string;

  protected stateService = inject(StateService);


  constructor(ohsomeApiMetadataProviderService: OhsomeApiMetadataProviderService,
              oqtApiMetadataProviderService: OqtApiMetadataProviderService) {
    this.hasAnnouncement = ohsomeApiMetadataProviderService.hasOhsomeApiAnnouncement();
    this.announcement = ohsomeApiMetadataProviderService.getOhsomeApiAnnouncement();
    this.ohsomeApiVersion = ohsomeApiMetadataProviderService.getOhsomeMetadataResponse()?.apiVersion ?? '';
    this.oqtApiVersion = oqtApiMetadataProviderService.getOqtApiMetadata()?.apiVersion ?? '';
    this.stateService.updatePartialState({showWelcomeScreen: this.urlHashParamsProviderService.getHashURLSearchParams().size === 0});
  }

  ngAfterViewInit(): void {
    this.handleAnnouncementClose();

    // initialize the language menu
    $('app-root #languageSelector').dropdown({
      selectOnKeydown: false,
      onChange: (language)=>this.switchLanguage(language)
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
    //location.reload()
    location.href = `../${selectedLanguage}/#${this.urlHashParamsProviderService.currentHashParams().toString()}`;
  }

}
