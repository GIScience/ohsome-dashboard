import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeCompletenessIndicatorComponent } from './attribute-completeness-indicator.component';
import {OqtModule} from '../../../oqt.module';
import {OqtApiMetadataProviderService} from '../../../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../../oqt-api-metadata-provider.service.mock';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {NgForm} from '@angular/forms';

describe('AttributeCompletenessIndicatorComponent', () => {
  let component: AttributeCompletenessIndicatorComponent;
  let fixture: ComponentFixture<AttributeCompletenessIndicatorComponent>;

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

    fixture = TestBed.createComponent(AttributeCompletenessIndicatorComponent);
    component = fixture.componentInstance;
    component.selectedTopicKey = "roads";
    component.topicName = "Roads";
    component.hashParams = new URLSearchParams("attribute-completeness--attributes=name");
    component.indicator = {
      "name": "Attribute Completeness",
      "description": "Derive the ratio of OSM features compared to features which match additional expected tags (e.g. amenity=hospital vs amenity=hospital and wheelchair=yes).",
      "projects": ["bkg"],
      "qualityDimension": "completeness",
      "key": "attribute-completeness",
      "checked": true
    }
    component.qualityDimension = component.indicator.qualityDimension;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
