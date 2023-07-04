import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OqtResultComponent} from './oqt-result.component';
import {HttpClientModule} from '@angular/common/http';
import {OqtApiMetadataProviderService} from '../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../oqt-api-metadata-provider.service.mock';
import {OqtModule} from '../oqt.module';



describe('OqtResultComponent', () => {
  let component: OqtResultComponent;
  let fixture: ComponentFixture<OqtResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OqtResultComponent ],
      imports:[HttpClientModule, OqtModule],
      providers: [
        {provide: OqtApiMetadataProviderService, useValue: OqtApiMetadataProviderServiceMock}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OqtResultComponent);
    component = fixture.componentInstance;
    component.formValues = {topic: Object.keys(component.metadata.result.topics)[0],'mapping-saturation':true, bboxes:"8.6252588,49.3819766,8.7295724,49.4364995"}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
