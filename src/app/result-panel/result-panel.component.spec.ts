import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ResultPanelComponent} from './result-panel.component';
import {ResultListDirective} from './result-list.directive';
import {DataService} from '../singelton-services/data.service';
import {beforeEach, describe, expect, it } from 'vitest';

describe('ResultPanelComponent', () => {
  let component: ResultPanelComponent;
  let fixture: ComponentFixture<ResultPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ResultListDirective, ResultPanelComponent],
    providers: [DataService]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
