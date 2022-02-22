import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FrameworkControlsStatus } from './framework-controls-status.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlsFacadeService } from 'core/modules/data/services';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { AppRoutes, WindowHelperService } from 'core';

describe('FrameworkControlsStatus', () => {
    let fixture: ComponentFixture<FrameworkControlsStatus>;
    let component: FrameworkControlsStatus;

    let controlsFacade: ControlsFacadeService;
    let windowHelper: WindowHelperService;

    const mockFramework = { framework_id: '1234', framework_name: 'name' };
    const mockControls = [
        { control_id: '123', control_name: '123' },
        { control_id: '678', control_name: '123' }
    ];


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
              { provide: ControlsFacadeService, useValue: {} },
              { provide: WindowHelperService, useValue: {} },
            ],
            declarations: [FrameworkControlsStatus],
        });

        fixture = TestBed.createComponent(FrameworkControlsStatus);
        component = fixture.componentInstance;
        controlsFacade = TestBed.inject(ControlsFacadeService);
        controlsFacade.getControlsByFrameworkId = jasmine
            .createSpy('getControlsByFrameworkId')
            .and.returnValue(of(mockControls));

        windowHelper = TestBed.inject(WindowHelperService);
        windowHelper.openUrlInNewTab = jasmine.createSpy('openUrlInNewTab');
    });

    it('should be able to create component instance', () => {
        expect(component).toBeDefined();
    });

    describe('ngOnInit', () => {
        beforeEach(() => {
            component.framework = mockFramework;
        });

        it('should call getControlsByFrameworkId', () => {
            // Arrange
            // Act
            fixture.detectChanges();

            // Assert
            expect(controlsFacade.getControlsByFrameworkId).toHaveBeenCalled();
        });

        it('should set controls$ with correct value', (done) => {
            // Act
            fixture.detectChanges();

            // Assert
            expect(component.controls$).toBeInstanceOf(Observable);
            component.controls$.subscribe((controls) => {
                expect(controls).toEqual(mockControls);
                done();
            });
        });
    });

  it('should call windowHelper.openUrlInNewTab with appropriate params', () => {
    // Arrange
    component.framework = {
      framework_id: 'id'
    };

    // Act
    fixture.detectChanges();
    component.generateReport();

    // Assert
    expect(windowHelper.openUrlInNewTab).toHaveBeenCalledWith(`/${AppRoutes.FrameworkReport}?framework_id=${component.framework.framework_id}`);
  });
});
