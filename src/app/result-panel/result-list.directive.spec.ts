import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ResultListDirective} from './result-list.directive';
import {DataService} from '../singelton-services/data.service';
import {of} from 'rxjs';
import {beforeEach, describe, expect, it, type MockedObject, type MockInstance, vi} from "vitest";

@Component({
    imports: [
        ResultListDirective
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
    <div appResultList></div>`
})
class HostComponent {
}

describe('ResultListDirective', () => {
    let fixture: ComponentFixture<HostComponent>;
    let dataService: MockedObject<DataService>;
    let spyCreateOqtComponent: MockInstance;
    let spyCreateOhsomeApiComponent: MockInstance;
    let directive: ResultListDirective;
    let dataSpy: any;

    beforeEach(async () => {
        dataSpy = {
            currentFormValues: vi.fn().mockName("DataService.currentFormValues")
        };

        await TestBed.configureTestingModule({
            imports: [HostComponent, ResultListDirective],
            providers: [
                { provide: DataService, useValue: dataSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        dataService = TestBed.inject(DataService) as MockedObject<DataService>;

        directive = fixture.debugElement
            .query(By.directive(ResultListDirective))
            .injector.get(ResultListDirective);

        spyCreateOqtComponent = vi.spyOn(directive as any, 'createOqtComponent').mockReturnValue(undefined);
        spyCreateOhsomeApiComponent = vi.spyOn(directive as any, 'createResultComponent').mockReturnValue(undefined);
    });

    it('should create the directive instance', () => {
        //dataSpy.currentFormValues.and.returnValue(of(mockResult));
        (dataService.currentFormValues as any) = of({
            formValues: { backend: 'oqtApi' },
            boundaryType: 'test'
        });
        fixture.detectChanges();

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
