import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiMultiSelectSearchDropdownComponent} from './sui-multi-select-search-dropdown.component';
import {beforeEach, describe, expect, it, vi} from "vitest";
import {before} from 'node:test';

describe('SuiDropdownComponent', () => {
  let component: SuiMultiSelectSearchDropdownComponent;
  let fixture: ComponentFixture<SuiMultiSelectSearchDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiMultiSelectSearchDropdownComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SuiMultiSelectSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('updates dropdown when value changes', () => {

    const setExactly = vi.fn();

    (globalThis as any).$ = vi.fn(() => ({
      dropdown: vi.fn((command, value) => {

        if (command === 'set exactly') {
          setExactly(value);
        }

      })
    }));


    component.value.set('bus-stops');

    fixture.detectChanges();


    expect(setExactly).toHaveBeenCalledWith('bus-stops');

  });


  it('updates value when dropdown changes', () => {
    let dropdownOptions: any;
    before(() => {
      (globalThis as any).$ = vi.fn(() => ({
        dropdown: vi.fn((options) => {
          dropdownOptions = options;
        })
      }));
    (component as any).initDropdown()
    })


    dropdownOptions.onChange('bus-stops');

    expect(component.value())
      .toBe('bus-stops');

  });

});
