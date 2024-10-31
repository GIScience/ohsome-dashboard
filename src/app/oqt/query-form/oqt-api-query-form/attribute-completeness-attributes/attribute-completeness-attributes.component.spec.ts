import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeCompletenessAttributesComponent } from './attribute-completeness-attributes.component';
import {OqtModule} from '../../../oqt.module';
import {OqtApiMetadataProviderService} from '../../../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../../oqt-api-metadata-provider.service.mock';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {NgForm} from '@angular/forms';

describe('AttributeCompletenessIndicatorComponent', () => {
  let component: AttributeCompletenessAttributesComponent;
  let fixture: ComponentFixture<AttributeCompletenessAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OqtModule],
      providers: [
        NgForm,
        { provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock },
        provideHttpClient(withInterceptorsFromDi())
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeCompletenessAttributesComponent);
    component = fixture.componentInstance;
    component.selectedTopicKey = "roads";
    component.topicName = "Roads";
    component.hashParams = new URLSearchParams("attribute-completeness--attributes=name");
    component.indicatorKey = "attribute-completeness";
    component.indicatorChecked = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
