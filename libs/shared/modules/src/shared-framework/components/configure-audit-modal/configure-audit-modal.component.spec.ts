import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfigureAuditModalComponent, FormControlKeys, ConfigureAuditModalEnum } from './configure-audit-modal.component';
import { SocTypes } from '../../constants';
import { WindowHelperService, AuditStartedModalService } from 'core/services';
import { FrameworkService } from 'core/modules/data/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { SocTwoFrameworkId } from 'core';
import { has } from 'lodash';
import { Subject } from 'rxjs';
import { Audit, Framework } from 'core/modules/data/models/domain';
import { configureTestSuite } from 'ng-bullet';

class MockSwitcherDir {
    public sharedContext$ = new Subject<{ framework: Framework, action: (framework: Framework, audit: Audit) => Promise<void>; }>();

    goById = jasmine.createSpy('goById');
}

describe('ConfigureAuditModalComponent', () => {
    configureTestSuite();
    let fixture: ComponentFixture<ConfigureAuditModalComponent>;
    let component: ConfigureAuditModalComponent;

    let frameworkService: FrameworkService;
    let translateService: TranslateService;
    let switcher: MockSwitcherDir;

    const mockFramework = { framework_id: SocTwoFrameworkId, framework_name: 'name', framework_current_audit: {} };
    const mockFrameworkWithAudit = {
        framework_id: SocTwoFrameworkId, framework_name: 'name', framework_current_audit: {
            audit_date: new Date("2021-12-01T22:00:00.000Z"),
            framework_fields: {
                type: SocTypes.type1,
            },
            framework_id: SocTwoFrameworkId,
            id: "audit_2146572907770",
            product_name: "rrrffrfrf",
        }
    };

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: FrameworkService, useValue: {} },
                { provide: TranslateService, useValue: {} },
                { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
                { provide: WindowHelperService, useValue: {} },
                { provide: AuditStartedModalService, useValue: {} },
            ],
            declarations: [ConfigureAuditModalComponent],
        });

        switcher = TestBed.inject(ComponentSwitcherDirective) as any;

        translateService = TestBed.inject(TranslateService);
        translateService.instant = jasmine.createSpy('instant');

        frameworkService = TestBed.inject(FrameworkService);
        frameworkService.getFrameworkIconLink = jasmine.createSpy('getFrameworkIconLink');

        fixture = TestBed.createComponent(ConfigureAuditModalComponent);
        component = fixture.componentInstance;
    });

    it('should be able to create component instance', () => {
        expect(component).toBeDefined();
    });

    describe('ngOnInit', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(ConfigureAuditModalComponent);
            component = fixture.componentInstance;
        });

        it('should set audit to correct value', () => {
            // Arrange
            component.framework = mockFrameworkWithAudit;

            // Act
            fixture.detectChanges();

            // Assert
            expect(component.audit).toEqual(mockFrameworkWithAudit.framework_current_audit);
        });

        it('should set form with soc type control when framework is SOC 2', () => {
            // Arrange
            component.framework = mockFrameworkWithAudit;

            // Act
            fixture.detectChanges();

            // Assert
            expect(has(component.form.items, FormControlKeys.soc_type)).toBeTruthy();
        });

        it('should set correct values in form when there is an existing audit', () => {
            // Arrange
            component.framework = mockFrameworkWithAudit;

            // Act
            fixture.detectChanges();

            // Assert
            expect(component.form.value[FormControlKeys.soc_type]).toEqual(mockFrameworkWithAudit.framework_current_audit.framework_fields.type);
            expect(component.form.value[FormControlKeys.audit_date]).toEqual(mockFrameworkWithAudit.framework_current_audit.audit_date);
            expect(component.form.value[FormControlKeys.product_name]).toEqual(mockFrameworkWithAudit.framework_current_audit.product_name);
        });

        it('should set form with audit range control when framework is SOC 2 and type 2', () => {
            const mockFrameworSoc2type2 = {
                framework_id: SocTwoFrameworkId, framework_name: 'name', framework_current_audit: {
                    audit_date: new Date("2021-12-01T22:00:00.000Z"),
                    framework_fields: {
                        type: SocTypes.type2
                    },
                    framework_id: "1234",
                    id: "audit_2146572907770",
                    product_name: "rrrffrfrf",
                }
            };

            // Arrange
            component.framework = mockFrameworSoc2type2;

            // Act
            fixture.detectChanges();

            // Assert
            expect(has(component.form.items, FormControlKeys.audit_range)).toBeTruthy();
        });
    });

    describe('getCurrentFrameworkIcon', () => {
        beforeEach(() => {
            frameworkService.getFrameworkIconLink = jasmine.createSpy('getFrameworkIconLink');
        });

        it('should call getFrameworkIconLink when framework exists', () => {
            // // Arrange
            component.framework = mockFrameworkWithAudit;

            // // Act
            component.getCurrentFrameworkIcon();

            // // Assert
            expect(frameworkService.getFrameworkIconLink).toHaveBeenCalledWith(mockFrameworkWithAudit.framework_id);
        });

        it('should NOT call getFrameworkIconLink when there is no framework', () => {
            // // Arrange
            component.framework = null;

            // // Act
            component.getCurrentFrameworkIcon();

            // // Assert
            expect(frameworkService.getFrameworkIconLink).toHaveBeenCalledTimes(0);
        });
    });

    describe('saveAudit', () => {
        it('should call action and goById with success value', async () => {
            // Arrange
            component.framework = mockFramework;
            const action = jasmine.createSpy('action');
            component.action = action;
            switcher.sharedContext$.next({ framework: mockFrameworkWithAudit, action });

            // Act
            fixture.detectChanges();
            await component.saveAudit();

            // // Assert
            expect(component.action).toHaveBeenCalled();
            expect(switcher.goById).toHaveBeenCalledWith(ConfigureAuditModalEnum.Success);
        });

        it('should call action with error and goById with error value', async () => {
            // Arrange
            component.framework = mockFramework;
            const action = jasmine.createSpy('action').and.throwError(new Error());
            component.action = action;
            switcher.sharedContext$.next({ framework: mockFrameworkWithAudit, action });

            // Act
            fixture.detectChanges();
            await component.saveAudit();

            // // Assert
            expect(component.action).toHaveBeenCalled();
            expect(switcher.goById).toHaveBeenCalledWith(ConfigureAuditModalEnum.Error);
        });
    });
});
