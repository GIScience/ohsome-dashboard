import {ComponentFixture, TestBed} from '@angular/core/testing';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultComponent],
      imports: [
        OshdbModule
      ],
      providers: [
        {provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock},
        provideHttpClient(withInterceptorsFromDi())]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ResultComponent);

    component = fixture.componentInstance;
    component.formValues = formValuesMock;
    component.boundaryType = 'bpoly';
    fixture.detectChanges();

    const testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    testContainer.appendChild(fixture.nativeElement);
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    document.getElementById('test-container')?.remove();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
