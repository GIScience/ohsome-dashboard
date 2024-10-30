import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OqtApiQueryFormComponent} from './oqt-api-query-form.component';
import {FormsModule, NgForm} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {OqtApiMetadataProviderService} from '../../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../oqt-api-metadata-provider.service.mock';
import {OqtModule} from '../../oqt.module';

describe('OqtApiQueryFormComponent', () => {
  let component: OqtApiQueryFormComponent;
  let fixture: ComponentFixture<OqtApiQueryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, OqtModule],
      declarations: [OqtApiQueryFormComponent],
      providers: [
        NgForm,
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OqtApiQueryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
