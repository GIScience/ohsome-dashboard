import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndicatorResultComponent} from './indicator-result.component';
import {HttpClientModule} from '@angular/common/http';

describe('IndicatorResultComponent', () => {
  let component: IndicatorResultComponent;
  let fixture: ComponentFixture<IndicatorResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndicatorResultComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IndicatorResultComponent);
    component = fixture.componentInstance;
    component.bpolys = {
      'features': [{
        'bbox': [
          8.6252588,
          49.3819766,
          8.7295724,
          49.4364995
        ],
        'geometry': {
          'coordinates': [
            [
              [
                8.6252588,
                49.3819766
              ],
              [
                8.7295724,
                49.3819766
              ],
              [
                8.7295724,
                49.4364995
              ],
              [
                8.6252588,
                49.4364995
              ],
              [
                8.6252588,
                49.3819766
              ]
            ]
          ],
          'type': 'Polygon'
        },
        'id': 'box 1',
        'properties': {
          'id': 'box 1'
        },
        'type': 'Feature'
      }
      ],
      'type': 'FeatureCollection'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
