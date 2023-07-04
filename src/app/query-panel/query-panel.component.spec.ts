import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {QueryPanelComponent} from './query-panel.component';
import {OhsomeApiMetadataProviderService} from '../oshdb/ohsome-api-metadata-provider.service';
import OhsomeApiMetadataProviderServiceMock from '../oshdb/ohsome-api-metadata-provider.service.mock';
import {OshdbModule} from '../oshdb/oshdb.module';

describe('QueryPanelComponent', () => {
  let component: QueryPanelComponent;
  let fixture: ComponentFixture<QueryPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[ OshdbModule],
      declarations: [ QueryPanelComponent ],
      providers:[
        {provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
