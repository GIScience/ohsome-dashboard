import {AfterViewInit, Component} from '@angular/core';
import {OhsomeApiMetadataProviderService} from './oshdb/ohsome-api-metadata-provider.service';
import { version } from '../../package.json';
import {OqtApiMetadataProviderService} from './oqt/oqt-api-metadata-provider.service';
declare let $;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements AfterViewInit{
  title = 'ohsome dashboard';
  public hasAnnouncement: boolean;
  public announcement: string;
  public currentYear: string = new Date().getFullYear().toString();
  protected readonly window = window;
  protected readonly frontendVersion: string = version;
  protected readonly ohsomeApiVersion: string;
  protected readonly oqtApiVersion: string;


  constructor(ohsomeApiMetadataProviderService: OhsomeApiMetadataProviderService, oqtApiMetadataProviderService: OqtApiMetadataProviderService) {
    this.hasAnnouncement = ohsomeApiMetadataProviderService.hasOhsomeApiAnnouncement();
    this.announcement = ohsomeApiMetadataProviderService.getOhsomeApiAnnouncement();
    this.ohsomeApiVersion = ohsomeApiMetadataProviderService.getOhsomeMetadataResponse()?.apiVersion ?? '';
    this.oqtApiVersion = oqtApiMetadataProviderService.getOqtApiMetadata().apiVersion ?? '';
  }

  ngAfterViewInit(): void {
    this.handleAnnouncementClose()
  }

  private handleAnnouncementClose() {
    $('#announcement .message .close')
      .on('click', function() {
        $('#announcement')
          .transition('fade')
        ;
      })
    ;
  }
}
