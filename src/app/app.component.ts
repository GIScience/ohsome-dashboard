import {AfterViewInit, Component} from '@angular/core';
import {OhsomeApiMetadataProviderService} from './oshdb/ohsome-api-metadata-provider.service';
declare let $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'ohsome dashboard';
  public hasAnnouncement: boolean;
  public announcement: string;
  public currentYear: string = new Date().getFullYear().toString();
  protected readonly window = window;

  constructor(ohsomeApiMetadataProviderService: OhsomeApiMetadataProviderService) {
    this.hasAnnouncement = ohsomeApiMetadataProviderService.hasOhsomeApiAnnouncement();
    this.announcement = ohsomeApiMetadataProviderService.getOhsomeApiAnnouncement();
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
