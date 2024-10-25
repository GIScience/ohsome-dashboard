import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleIndicatorComponent} from './simple-indicator.component';
import {NgForm} from '@angular/forms';
import {OqtModule} from '../../../oqt.module';

describe('SimpleIndicatorComponent', () => {
  let component: SimpleIndicatorComponent;
  let fixture: ComponentFixture<SimpleIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OqtModule],
      declarations: [SimpleIndicatorComponent],
      providers: [
        NgForm,
      ]

    })
      .compileComponents();

    fixture = TestBed.createComponent(SimpleIndicatorComponent);
    component = fixture.componentInstance;
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
