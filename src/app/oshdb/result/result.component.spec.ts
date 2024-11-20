import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ResultComponent} from './result.component';
import {OshdbModule} from '../oshdb.module';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {OhsomeApiMetadataProviderService} from '../ohsome-api-metadata-provider.service';
import OhsomeApiMetadataProviderServiceMock from '../ohsome-api-metadata-provider.service.mock';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  const formValuesMock = {
    'keys': 'natural',
    'types': ['node']
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultComponent ],
      imports: [
        OshdbModule
      ],
      providers:[
        { provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock },
        provideHttpClient(withInterceptorsFromDi())]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    component.formValues = formValuesMock;
    component.boundaryType = 'bpoly';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
