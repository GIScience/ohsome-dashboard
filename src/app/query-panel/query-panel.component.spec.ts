import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QueryPanelComponent} from './query-panel.component';
import {OhsomeApiMetadataProviderService} from '../ohsomeapi/ohsome-api-metadata-provider.service';
import OhsomeApiMetadataProviderServiceMock from '../ohsomeapi/ohsome-api-metadata-provider.service.mock';
import {BrowserModule} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {OqtModule} from '../02_quality/oqt.module';
import {StateService} from '../singelton-services/state.service';
import {beforeEach, describe, expect, it} from 'vitest';

describe('QueryPanelComponent', () => {
  let component: QueryPanelComponent;
  let fixture: ComponentFixture<QueryPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BrowserModule,
        OqtModule, QueryPanelComponent],
    providers: [
        { provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock },
        provideHttpClient()
    ]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryPanelComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('clears bpolys when switching from bpoly to admin so a stale non-GeoJSON value cannot leak in', () => {
    const stateService = TestBed.inject(StateService);
    stateService.boundaryType.set('bpoly');
    stateService.sharedFormSignals.bpolys.set('8.67,49.41,8.68,49.42,8.69,49.41,8.67,49.41');
    fixture.detectChanges();

    component['mapInput'] = {map: {getCenter: () => ({lat: 0, lng: 0}), getZoom: () => 1}} as any;

    expect(() => component['setBoundaryType']('admin')).not.toThrow();
    fixture.detectChanges();

    expect(stateService.boundaryType()).toBe('admin');
    expect(stateService.sharedFormSignals.bpolys()).toBe('');
  });
});
