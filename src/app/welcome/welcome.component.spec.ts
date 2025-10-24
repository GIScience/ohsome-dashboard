import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {OqtApiMetadataProviderService} from '../oqt/oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../oqt/oqt-api-metadata-provider.service.mock';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
