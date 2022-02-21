import { ModalWindowService } from 'core/modules/modals/services/modal-window/modal-window.service';
import { FrameworkStatus } from 'core/modules/data/models';
import { UserStatus } from 'core/models/user-status';
import { FrameworksState } from 'core/modules/data/store/reducers';
import { reducers } from 'core/modules/data/store';
import { ResendUserInvitationAction } from 'core/modules/auth-core/store';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MessageBusService } from 'core/services';
import { VisibleForRoleDirective } from 'core/modules/directives';
import { AuthService, RoleService, UserFacadeService } from 'core/modules/auth-core/services';
import { OperationsTrackerService, TrackOperations, FrameworksFacadeService } from 'core/modules/data/services';
import { of, Subject } from 'rxjs';
import { Framework } from 'core/modules/data/models/domain';
import { UserItemComponent } from './user-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';
import { TemplateRef } from '@angular/core';

describe('UserItemComponent', () => {
  configureTestSuite();

  let component: UserItemComponent;
  let fixture: ComponentFixture<UserItemComponent>;

  let testedFramework: Framework;
  let mockStore: MockStore;
  let operationsTrackerService: OperationsTrackerService;
  let roleService: RoleService;
  let authServiceMock: AuthService;
  let modalWindowService: ModalWindowService;
  let userFacade: UserFacadeService;
  let mockedFrameworks: Framework[];

  let eventSubject: Subject<Error | null>;

  let frameworksFacade: FrameworksFacadeService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserItemComponent, VisibleForRoleDirective],
      imports: [TranslateModule.forRoot(), StoreModule.forRoot(reducers)],
      providers: [
        OperationsTrackerService,
        MessageBusService,
        provideMockStore(),
        { provide: RoleService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: UserFacadeService, useValue: {} },
        { provide: ModalWindowService, useValue: {} }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserItemComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    operationsTrackerService = TestBed.inject(OperationsTrackerService);
    roleService = TestBed.inject(RoleService);
    authServiceMock = TestBed.inject(AuthService);
    modalWindowService = TestBed.inject(ModalWindowService);
    userFacade = TestBed.inject(UserFacadeService);
    authServiceMock.getUserAsync = jasmine
      .createSpy('getUserAsync')
      .and.returnValue(Promise.resolve({ email: 'user@example.com' }));
    roleService.getCurrentUserRole = jasmine.createSpy('getCurrentUserRole');
    roleService.getAuditIdFromUserRoleOfSpecificUser = jasmine
      .createSpy('getAuditIdFromUserRoleOfSpecificUser')
      .and.returnValue('testAuditId123');
    eventSubject = new Subject<any>();
    operationsTrackerService.getOperationStatus = jasmine
      .createSpy('getOperationStatus')
      .and.callFake((perationId: any, partition: string) => eventSubject);
    operationsTrackerService.trackSuccess = jasmine
      .createSpy('trackSuccess')
      .and.callFake((operationId: any, partition: string) => eventSubject.next(null));

    operationsTrackerService.trackError = jasmine
      .createSpy('trackError')
      .and.callFake((operationId: any, partition: string) => eventSubject.next(new Error()));

    testedFramework = {
      framework_name: 'testedFrameworkName',
    };

    const frameworksState: FrameworksState = {
      entities: {
        ['12345']: testedFramework,
      },
      ids: ['12345'],
      initialized: true,
    };

    mockStore.setState({
      frameworksState,
      controlsState: {
        controlsByFramework: {},
        areAllLoaded: true,
        controlFrameworkMapping: {},
      },
      requirementState: {
        controlRequirements: {
          entities: [],
        },
      },
      evidencesState: {
        evidences: {
          entities: [],
        },
      },
    });

    mockedFrameworks = [
      {
        framework_name: 'testedFrameworkName',
        framework_id: '121312',
        is_applicable: true,
        framework_status: FrameworkStatus.AVAILABLE,
      },
    ];

    component.user = {
      email: 'testEmail',
      role: RoleEnum.It,
      status: 'active',
      is_current_user: true,
      audit_frameworks: [mockedFrameworks[0].framework_id],
    };

    frameworksFacade = TestBed.inject(FrameworksFacadeService);

    frameworksFacade.getFrameworks = jasmine.createSpy('getFrameworks').and.returnValue(of(mockedFrameworks));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('#onInit', () => {
    it(`if user has Audit role type, the auditorFrameworkNames$ should be filled with related audit framework names`, async () => {
      // Arrange

      component.user.role = RoleEnum.Auditor;
      component.user.audit_id = 'testAuditId123';

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const res = await component.auditorFrameworkNames$.pipe(take(1)).toPromise();

      const frameworkNamesArray = Object.keys(res);
      expect(frameworkNamesArray.find((key) => key === testedFramework.framework_name)).toBeTruthy();
      expect(frameworkNamesArray.length).toBe(1);
    });
  });

  describe('#resolveUserIcon', () => {
    it(`if user is in provisioning state, should return icon path for empty avatar`, async () => {
      // Arrange

      spyOn(component, 'checkIsUserInPendingState').and.returnValue(true);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const iconPath = component.resolveUserIcon();

      // Assert

      expect(iconPath).toEqual('audit/profile_mask_empty');
    });

    it(`if user is not in provisioning state, and role is auditor, should return icon path for auditor user type`, async () => {
      // Arrange
      component.user.role = RoleEnum.Auditor;

      spyOn(component, 'checkIsUserInPendingState').and.returnValue(false);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const iconPath = component.resolveUserIcon();

      // Assert

      expect(iconPath).toEqual('audit/profile_mask_auditor');
    });

    it(`if user is not in provisioning state, and role is not auditor, should return icon path for regular user type`, async () => {
      // Arrange
      component.user.role = RoleEnum.It;

      spyOn(component, 'checkIsUserInPendingState').and.returnValue(false);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const iconPath = component.resolveUserIcon();

      // Assert

      expect(iconPath).toEqual('audit/profile_mask');
    });

    it(`if user is not in provisioning state, and role is not auditor, should return icon path for regular user type`, async () => {
      // Arrange
      component.user.role = RoleEnum.Admin;

      spyOn(component, 'checkIsUserInPendingState').and.returnValue(false);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const iconPath = component.resolveUserIcon();

      // Assert

      expect(iconPath).toEqual('audit/profile_mask');
    });
  });

  describe('#resolveUserTypeIconPath', () => {
    it(`if user type is auditor, should return path to auditor type icon`, async () => {
      // Arrange
      component.user.role = RoleEnum.Auditor;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const iconPath = component.resolveUserTypeIconPath();

      // Assert

      expect(iconPath).toEqual('user-types/auditor');
    });

    it(`if user type is IT, should return path to it type icon`, async () => {
      // Arrange
      component.user.role = RoleEnum.It;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const iconPath = component.resolveUserTypeIconPath();

      // Assert

      expect(iconPath).toEqual('user-types/it');
    });

    it(`if user type is admin, should return path to admin type icon`, async () => {
      // Arrange
      component.user.role = RoleEnum.Admin;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const iconPath = component.resolveUserTypeIconPath();

      // Assert

      expect(iconPath).toEqual('user-types/admin');
    });
  });

  describe('#change-password', () => {
    // it(`should render change password link when it is current user`, async () => {
    //   // Arrange
    //   component.user = { email: 'testEmail', role: RoleEnum.Admin, status: 'active', is_current_user: true };
    //   // Act
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   // Assert
    //   expect(fixture.debugElement.query(By.css('a.change-password'))).toBeTruthy();
    // });
  });

  describe('#removeUser', () => {
    describe('When user role is not admin', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(UserItemComponent);
        component = fixture.componentInstance;
        roleService = TestBed.inject(RoleService);
        roleService.getCurrentUserRole = jasmine
          .createSpy('getCurrentUserRole')
          .and.callFake(() => of({ role: RoleEnum.User }));
        component.user = { email: 'testEmail', role: RoleEnum.User, status: 'active', is_current_user: true };
      });

      it(`should not render remove button`, async () => {
        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        // Assert
        expect(fixture.debugElement.query(By.css('#remove'))).toBeFalsy();
      });
    });

    describe('When user role is admin', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(UserItemComponent);
        component = fixture.componentInstance;
        roleService = TestBed.inject(RoleService);
        roleService.getCurrentUserRole = jasmine
          .createSpy('getCurrentUserRole')
          .and.callFake(() => of({ role: RoleEnum.Admin }));
      });

      it(`should render remove button when it is not current user`, async () => {
        // Arrange
        component.user = { email: 'testEmail', role: RoleEnum.Admin, status: 'active', is_current_user: false };
        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        // Assert
        expect(fixture.debugElement.query(By.css('#remove'))).toBeTruthy();
      });
    });

    describe('click on remove', () => {
      beforeEach(() => {
        roleService.getCurrentUserRole = jasmine
          .createSpy('getCurrentUserRole')
          .and.callFake(() => of({ role: RoleEnum.Admin }));
        component.user = { email: 'testEmail', role: RoleEnum.Admin, status: 'active', is_current_user: false };

      });

      it(`should call openRemoveConfirmationModal method`, async () => {
        // Arrange
        component.checkIsUserInPendingState = jasmine.createSpy('checkIsUserInPendingState').and.returnValue(false);
        component.openRemoveConfirmationModal = jasmine.createSpy('openRemoveConfirmationModal');

        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        const removeButton = fixture.debugElement.query(By.css('#remove')).nativeElement;
        removeButton.dispatchEvent(new Event('click'));

        // Assert
        expect(fixture.debugElement.query(By.css('#remove'))).toBeTruthy();
        expect(component.openRemoveConfirmationModal).toHaveBeenCalled();
      });
    });

    describe('openRemoveConfirmationModal', () => {
      beforeEach(() => {
        roleService.getCurrentUserRole = jasmine
          .createSpy('getCurrentUserRole')
          .and.callFake(() => of({ role: RoleEnum.Admin }));
        component.user = { email: 'testEmail', role: RoleEnum.Admin, status: 'active', is_current_user: false };

      });

      it(`should open the modal`, async () => {
        // Arrange
        modalWindowService.open = jasmine.createSpy('open');

        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        component.openRemoveConfirmationModal();

        // Assert
        expect(modalWindowService.open).toHaveBeenCalledWith({ template: jasmine.any(TemplateRef) });
      });
    });

    describe('removeUser method', () => {
      beforeEach(() => {
        roleService.getCurrentUserRole = jasmine
          .createSpy('getCurrentUserRole')
          .and.callFake(() => of({ role: RoleEnum.Admin }));
        component.user = { email: 'testEmail', role: RoleEnum.Admin, status: 'active', is_current_user: false };

      });

      it(`should call remove method from userFacade`, async () => {
        // Arrange
        userFacade.removeUser = jasmine.createSpy('removeUser');

        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        component.removeUser();

        // Assert
        expect(userFacade.removeUser).toHaveBeenCalledWith(component.user.email);
      });
    });
  });

  describe('#resendInvitation', () => {
    it(`should proceed next value for resend button loader and dispatch ResendUserInvitationAction`, async () => {
      // Arrange

      spyOn(component.resendButtonLoader$, 'next');
      spyOn(mockStore, 'dispatch');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      component.resendInvitation();

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.any(ResendUserInvitationAction));
      expect(component.resendButtonLoader$.next).toHaveBeenCalledWith(true);
    });
  });

  describe('#checkIsUserInPendingState', () => {
    it(`if user status is PROVISIONED, should return true`, async () => {
      // Arrange

      component.user.status = UserStatus.PROVISIONED;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const result = component.checkIsUserInPendingState();

      // Assert
      expect(result).toBeTrue();
    });

    it(`if user status is STAGED, should return true`, async () => {
      // Arrange

      component.user.status = UserStatus.STAGED;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const result = component.checkIsUserInPendingState();

      // Assert
      expect(result).toBeTrue();
    });

    it(`if user status is not Staged or Provisioned, should return false`, async () => {
      // Arrange

      component.user.status = UserStatus.ACTIVE;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      const result1 = component.checkIsUserInPendingState();

      // Assert
      expect(result1).toBeFalse();

      // Arrange
      component.user.status = UserStatus.DEPROVISIONED;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      const result2 = component.checkIsUserInPendingState();

      // Assert
      expect(result2).toBeFalse();

      // Arrange
      component.user.status = UserStatus.PASSWORD_EXPIRED;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      const result3 = component.checkIsUserInPendingState();

      // Assert
      expect(result3).toBeFalse();

      // Arrange
      component.user.status = UserStatus.RECOVERY;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      const result4 = component.checkIsUserInPendingState();

      // Assert
      expect(result4).toBeFalse();
    });
  });

  describe('#listeners for remove and resend operations', () => {
    it(`should set restButton loading state to false when ${TrackOperations.UPDATE_USER} operation succeded`, async () => {
      // Arrange
      spyOn(component.resendButtonLoader$, 'next');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      operationsTrackerService.trackSuccess(component.user.email, TrackOperations.UPDATE_USER);

      // Assert
      expect(operationsTrackerService.getOperationStatus).toHaveBeenCalledWith(
        component.user.email,
        TrackOperations.UPDATE_USER
      );
      expect(component.resendButtonLoader$.next).toHaveBeenCalledWith(false);
    });

    it(`should set restButton loading state to false when ${TrackOperations.UPDATE_USER} operation error`, async () => {
      // Arrange
      spyOn(component.resendButtonLoader$, 'next');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      operationsTrackerService.trackError(component.user.email, new Error(), TrackOperations.UPDATE_USER);

      // Assert
      expect(operationsTrackerService.getOperationStatus).toHaveBeenCalledWith(
        component.user.email,
        TrackOperations.UPDATE_USER
      );
      expect(component.resendButtonLoader$.next).toHaveBeenCalledWith(false);
    });
  });
});
