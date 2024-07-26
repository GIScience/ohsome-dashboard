import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OqtApiQueryFormComponent} from './oqt-api-query-form.component';
import {FormsModule, NgForm} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {OqtApiMetadataProviderService} from '../../oqt-api-metadata-provider.service';
import OqtApiMetadataProviderServiceMock from '../../oqt-api-metadata-provider.service.mock';

describe('OqtApiQueryFormComponent', () => {
  let component: OqtApiQueryFormComponent;
  let fixture: ComponentFixture<OqtApiQueryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
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

  it('names can be extracted from attributes', () => {

    // create single key-value-pair
    const buildingCountAttribute = {
      name: 'Height of Buildings',
      description: 'TODO',
      filter: 'height=* or building:levels=*'
    }
    const keyAndValue = {
      key: "height",
      value: buildingCountAttribute
    };

    // setup component
    component._selectedTopicKey = keyAndValue.key


    const result = component.getEntry(keyAndValue);
    const expected: string =buildingCountAttribute.name;

    console.log("*****************************************")
    console.log(keyAndValue)
    console.log(result)
    console.log("*****************************************")

    expect(result).toEqual(expected)

  });
});
