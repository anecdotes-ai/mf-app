import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { FrameworkAuditInfo } from './framework-audit-info.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { TranslateModule } from '@ngx-translate/core';
import { InviteUserModalService } from 'core/modules/invite-user';
import { ConfigureAuditModalService } from 'core/modules/shared-framework/services';
import { Router } from '@angular/router';
import { AppRoutes } from 'core';
import { LocalDatePipe } from 'core/modules/pipes';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { configureTestSuite } from 'ng-bullet';
import { InviteUserSource } from 'core/models/user-events/user-event-data.model';

describe('FrameworkAuditInfo', () => {
    configureTestSuite();
    let fixture: ComponentFixture<FrameworkAuditInfo>;
    let component: FrameworkAuditInfo;

    let inviteUserModalService: InviteUserModalService;
    let configureAuditModalService: ConfigureAuditModalService;
    let frameworksFacade: FrameworksFacadeService;
    let router: Router;

    const mockFramework = { framework_id: '1234', framework_name: 'name', framework_current_audit: {} };
    const mockFrameworkWithAudit = {
        framework_id: '1234', framework_name: 'name', framework_current_audit: {
            audit_date: new Date("2021-12-01T22:00:00.000Z"),
            framework_fields: {
                "type": "type1"
            },
            framework_id: "1234",
            id: "audit_2146572907770",
            product_name: "rrrffrfrf",
        }
    };
    const mockAuditors = [{ first_name: 'bla', last_name: 'blo' }, { first_name: 'bla2', last_name: 'blo2' }];

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: LocalDatePipe, useValue: {} },
                { provide: InviteUserModalService, useValue: {} },
                { provide: ConfigureAuditModalService, useValue: {} },
                { provide: FrameworksFacadeService, useValue: {} },
                { provide: Router, useValue: {} },
            ],
            declarations: [FrameworkAuditInfo],
        });

        inviteUserModalService = TestBed.inject(InviteUserModalService);
        inviteUserModalService.openInviteUserModal = jasmine.createSpy('openInviteUserModal');

        configureAuditModalService = TestBed.inject(ConfigureAuditModalService);
        configureAuditModalService.openConfigureAuditModal = jasmine.createSpy('openConfigureAuditModal');

        frameworksFacade = TestBed.inject(FrameworksFacadeService);
        frameworksFacade.setFrameworkAudit = jasmine.createSpy('setFrameworkAudit');
        frameworksFacade.updateFrameworkAudit = jasmine.createSpy('updateFrameworkAudit');
        frameworksFacade.deleteFrameworkAudit = jasmine.createSpy('deleteFrameworkAudit');

        router = TestBed.inject(Router);
        router.navigate = jasmine.createSpy('navigate');

        fixture = TestBed.createComponent(FrameworkAuditInfo);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be able to create component instance', () => {
        expect(component).toBeDefined();
    });

    describe('ngOnInit', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(FrameworkAuditInfo);
            component = fixture.componentInstance;
        });

        it('should set audit to null when framework has no current audit', () => {
            // Arrange
            component.framework = mockFramework;

            // Act
            fixture.detectChanges();

            // Assert
            expect(component.audit).toEqual(null);
        });

        it('should set audit to current audit when framework has audit', () => {
            // Arrange
            component.framework = mockFrameworkWithAudit;

            // Act
            fixture.detectChanges();

            // Assert
            expect(component.audit).toEqual(mockFrameworkWithAudit.framework_current_audit);
        });
    });

    describe('ngOnChanges', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(FrameworkAuditInfo);
            component = fixture.componentInstance;
        });

        it('should set audit with correct value when there was an audit before', async () => {
            // Arrange
            const changes: SimpleChanges = {
                framework: {
                    currentValue: mockFramework,
                } as any,
            };

            fixture.detectChanges();
            // Act
            component.ngOnChanges(changes);

            // Assert
            expect(component.audit).toEqual(null);
        });
    });

    describe('getAssignedAuditorValue', () => {
        it('should return `notInvited` translation key when there is an audit and no auditors assigned', () => {
            // Arrange
            component.auditors = [];
            component.audit = mockFrameworkWithAudit.framework_current_audit;

            // Act
            const value = component.getAssignedAuditorValue();

            // Assert
            expect(value).toEqual(component.buildTranslationKey('notInvited'));
        });

        it('should return the auditors list when there are more than 1 auditor', () => {
            // Arrange
            component.auditors = mockAuditors;
            component.audit = mockFrameworkWithAudit.framework_current_audit;

            // Act
            const value = component.getAssignedAuditorValue();

            // Assert
            expect(value).toEqual(mockAuditors);
        });

        it('should return auditor full name when there is exactly 1 auditor', () => {
            // Arrange
            component.auditors = [mockAuditors[0]];
            component.audit = mockFrameworkWithAudit.framework_current_audit;

            // Act
            const value = component.getAssignedAuditorValue();

            // Assert
            expect(value).toEqual(`${mockAuditors[0].first_name} ${mockAuditors[0].last_name}`);
        });
    });

    describe('inviteAuditor', () => {
        it('should call openInviteUserModal', () => {
            // Arrange
            component.framework = mockFrameworkWithAudit;

            // Act
            component.inviteAuditor();

            // Assert
            expect(inviteUserModalService.openInviteUserModal).toHaveBeenCalledWith(InviteUserSource.FrameworkManager,RoleEnum.Auditor, null, mockFrameworkWithAudit);
        });
    });

    describe('setupAudit', () => {
        it('should call openConfigureAuditModal', () => {
            // Arrange
            component.framework = mockFrameworkWithAudit;

            // Act
            component.setupAudit();

            // Assert
            expect(configureAuditModalService.openConfigureAuditModal).toHaveBeenCalled();
        });
    });

    describe('threeDotsMenuActions', () => {
        describe('editAudit action', () => {
            const menuActionIndex = 1;

            it('should call openConfigureAuditModal when calling editAudit action', () => {
                // Act
                fixture.detectChanges();
                component.threeDotsMenu[menuActionIndex].action();

                // Assert
                expect(configureAuditModalService.openConfigureAuditModal).toHaveBeenCalled();
            });
        });

        describe('resetAudit action', () => {
            const menuActionIndex = 2;

            it('should call deleteFrameworkAudit when calling resetAudit action', () => {
                // Arrange
                component.framework = mockFramework;

                // Act
                fixture.detectChanges();
                component.threeDotsMenu[menuActionIndex].action();

                // Assert
                expect(frameworksFacade.deleteFrameworkAudit).toHaveBeenCalledWith(mockFramework);
            });
        });

        describe('manageAuditor action', () => {
            const menuActionIndex = 3;

            it('should navigate to user management when calling manageAuditor action', () => {
                // Act
                fixture.detectChanges();
                component.threeDotsMenu[menuActionIndex].action();

                // Assert
                expect(router.navigate).toHaveBeenCalledWith([`/${AppRoutes.Settings}/${AppRoutes.UserManagement}`]);
            });
        });
    });
});
