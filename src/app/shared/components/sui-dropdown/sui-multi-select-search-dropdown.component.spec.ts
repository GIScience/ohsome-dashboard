import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SuiMultiSelectSearchDropdownComponent} from './sui-multi-select-search-dropdown.component';

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

  it('should update the value when writeValue is called', async () => {
    spyOn(component, 'updateDropdown')

    component.writeValue(['test value']);

    expect(component.value).toEqual(['test value']);
    expect(component.updateDropdown).toHaveBeenCalled();
  });

});
