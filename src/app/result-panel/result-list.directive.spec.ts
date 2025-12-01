import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ResultListDirective } from './result-list.directive';
import { DataService } from '../singelton-services/data.service';
import { of } from 'rxjs';

@Component({
  imports: [
    ResultListDirective
  ],
  template: `
    <div appResultList></div>`
})
class HostComponent {}

describe('ResultListDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let dataService: jasmine.SpyObj<DataService>;
  let spyCreateOqtComponent: jasmine.Spy<any>;
  let spyCreateOhsomeApiComponent: jasmine.Spy<any>;
  let directive: ResultListDirective;
  let dataSpy: any;

  beforeEach(async () => {
    dataSpy = jasmine.createSpyObj('DataService', ['currentFormValues'])

    await TestBed.configureTestingModule({
      imports: [HostComponent, ResultListDirective],
      providers: [
        { provide: DataService, useValue: dataSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;

    directive = fixture.debugElement
      .query(By.directive(ResultListDirective))
      .injector.get(ResultListDirective);

    spyCreateOqtComponent = spyOn(directive as any, 'createOqtComponent');
    spyCreateOhsomeApiComponent = spyOn(directive as any, 'createResultComponent');
  });

  it('should create the directive instance', () => {
    //dataSpy.currentFormValues.and.returnValue(of(mockResult));
    (dataService.currentFormValues as any) = of({
      formValues: { backend: 'oqtApi' },
      boundaryType: 'test'
    });
    fixture.detectChanges()

    expect(directive).toBeTruthy();
  });

  it('should call createOqtComponent when backend is oqtApi', () => {
    (dataService.currentFormValues as any) = of({
      formValues: { backend: 'oqtApi' },
      boundaryType: 'test'
    });
    fixture.detectChanges();

    expect(spyCreateOqtComponent).toHaveBeenCalledTimes(1);
  });

  it('should call createComponent when backend is ohsomeApi', () => {
    (dataService.currentFormValues as any) = of({
      formValues: { backend: 'ohsomeApi' },
      boundaryType: 'test'
    });
    fixture.detectChanges();

    expect(spyCreateOhsomeApiComponent).toHaveBeenCalledTimes(1);
  });
});
