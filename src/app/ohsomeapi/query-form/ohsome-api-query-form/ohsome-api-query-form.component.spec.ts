import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OhsomeApiQueryFormComponent} from './ohsome-api-query-form.component';
import {OhsomeApiMetadataProviderService} from '../../ohsome-api-metadata-provider.service';
import OhsomeApiMetadataProviderServiceMock from '../../ohsome-api-metadata-provider.service.mock';
import {OshdbModule} from '../../oshdb.module';
import {NgForm} from '@angular/forms';

describe('OhsomeApiQueryFormComponent', () => {
  let component: OhsomeApiQueryFormComponent;
  let fixture: ComponentFixture<OhsomeApiQueryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OshdbModule, OhsomeApiQueryFormComponent],
    providers: [
        NgForm,
        { provide: OhsomeApiMetadataProviderService, useValue: OhsomeApiMetadataProviderServiceMock }
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(OhsomeApiQueryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
