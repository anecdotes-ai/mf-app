import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FrameworkManager } from './framework-manager.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrameworksFacadeService, FrameworkService } from 'core/modules/data/services';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { configureTestSuite } from 'ng-bullet';
import { WindowHelperService, AuditStartedModalService } from 'core/services';
import { ModalWindowService } from 'core/modules/modals';
import { EndAuditModalService } from 'core/modules/shared-framework';
import { RoleService } from 'core/modules/auth-core/services';
import { ExploreControlsSource } from 'core';

describe('FrameworkManager', () => {
    configureTestSuite();

    let fixture: ComponentFixture<FrameworkManager>;
    let component: FrameworkManager;

    let frameworkService: FrameworkService;
    let frameworksFacade: FrameworksFacadeService;
    let controlsNavigatorMock: ControlsNavigator;
    let windowHelper: WindowHelperService;
    let roleService: RoleService;

    const mockFramework = { framework_id: '1234', framework_name: 'name' };
    const iconMock = 'iconMock';

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: FrameworkService, useValue: {} },
                { provide: FrameworksFacadeService, useValue: {} },
                { provide: ControlsNavigator, useValue: {} },
                { provide: ActivatedRoute, useValue: {} },
                { provide: WindowHelperService, useValue: {} },
                { provide: ModalWindowService, useValue: {} },
                { provide: AuditStartedModalService, useValue: {} },
                { provide: EndAuditModalService, useValue: {} },
                { provide: RoleService, useValue: {} }
            ],
            declarations: [FrameworkManager],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FrameworkManager);
        component = fixture.componentInstance;
        frameworkService = TestBed.inject(FrameworkService);
        frameworkService.getFrameworkIconLink = jasmine.createSpy('getFrameworkIconLink').and.returnValue('iconMock');
        frameworksFacade = TestBed.inject(FrameworksFacadeService);
        frameworksFacade.getFrameworkByName = jasmine
            .createSpy('getFrameworkByName')
            .and.returnValue(of(mockFramework));
        controlsNavigatorMock = TestBed.inject(ControlsNavigator);
        controlsNavigatorMock.navigateToControlsPageAsync = jasmine.createSpy('navigateToControlsPageAsync');
        roleService = TestBed.inject(RoleService);
        roleService.isAuditor = jasmine.createSpy('isAuditor') .and.returnValue(of(false));

        windowHelper = TestBed.inject(WindowHelperService);
        windowHelper.getWindow = jasmine.createSpy('getWindow');
    });

    it('should be able to create component instance', () => {
        expect(component).toBeDefined();
    });

    describe('ngOnInit', () => {
        it('should call getFrameworkByName', () => {
            // Arrange
            // Act
            fixture.detectChanges();

            // Assert
            expect(frameworksFacade.getFrameworkByName).toHaveBeenCalled();
        });

        it('should set framework with correct value', () => {
            // Act
            fixture.detectChanges();

            // Assert
            expect(component.framework).toBe(mockFramework);
        });

        it('should call isAuditor and set correct value', async () => {
            // Act
            fixture.detectChanges();

            // Assert
            expect(roleService.isAuditor).toHaveBeenCalled();
            expect(component.isAuditor).toEqual(false);
        });
    });

    describe('getCurrentFrameworkIcon', () => {
        it('should get framework icon if framework exists', async () => {
            // Arrange
            component.framework = mockFramework;

            // Act
            const icon = component.getCurrentFrameworkIcon();

            // Assert
            expect(frameworkService.getFrameworkIconLink).toHaveBeenCalled();
            expect(icon).toBe(iconMock);
        });

        it('should not get framework icon if framework does not exist', async () => {
            // Arrange
            component.framework = undefined;

            // Act
            component.getCurrentFrameworkIcon();

            // Assert
            expect(frameworkService.getFrameworkIconLink).not.toHaveBeenCalled();
        });
    });

    describe('exploreControls', () => {
        it('should navigate to controls page with framework name', () => {
            // Arrange
            component.framework = mockFramework;

            // Act
            component.exploreControls(new MouseEvent('click'));

            // Assert
            expect(controlsNavigatorMock.navigateToControlsPageAsync).toHaveBeenCalledWith(mockFramework.framework_id, null, ExploreControlsSource.FrameworkManager);
        });
    });
});
