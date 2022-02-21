import { async, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AppRoutes } from 'core';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { RoleService } from 'core/modules/auth-core/services';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthRoleGuard } from './auth-role.guard';

describe('AuthRoleGuard', () => {
  let serviceUnderTest: AuthRoleGuard;
  let roleService: RoleService;
  let router: Router;
  let userAuditIdToReturn: string;
  let route: ActivatedRouteSnapshot;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [AuthRoleGuard, { provide: RoleService, useValue: {} }, { provide: Router, useValue: {} }],
    });
  }));

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(AuthRoleGuard);
    roleService = TestBed.inject(RoleService);
    router = TestBed.inject(Router);

    roleService.getAuditIdFromUserRole = jasmine.createSpy('getAuditIdFromUserRole').and.callFake(() => of({}));
    roleService.getCurrentUserRole = jasmine.createSpy('getCurrentUserRole').and.callFake(() => of({}));
    router.navigate = jasmine.createSpy('navigate');
    route = {} as ActivatedRouteSnapshot;
  });

  describe('canActivate function', () => {
    it('should return true if current role is allowed to see this page', async () => {
      // Arrange
      route.data = { roles: [RoleEnum.Admin] };
      roleService.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: RoleEnum.Admin }));

      // Act
      const actual = await serviceUnderTest.canActivate(route).pipe(take(1)).toPromise();

      // Assert
      expect(actual).toBeTrue();
    });

    it(`should return false if current role is ${RoleEnum.Auditor} and this page is hidden for ${RoleEnum.Auditor}`, async () => {
      // Arrange
      route.data = { roles: [RoleEnum.Admin] };
      roleService.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: RoleEnum.Auditor }));

      // Act
      const actual = await serviceUnderTest.canActivate(route).pipe(take(1)).toPromise();

      // Assert
      expect(actual).toBeFalse();
    });

    it(`should call navigate function with url to audit page if current role is ${RoleEnum.Auditor} and this page is hidden for ${RoleEnum.Auditor}`, async () => {
      // Arrange
      route.data = { roles: [RoleEnum.Admin] };
      roleService.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: RoleEnum.Auditor }));

      userAuditIdToReturn = 'fake-audit-id';
      roleService.getAuditIdFromUserRole = jasmine
        .createSpy('getAuditIdFromUserRole')
        .and.callFake(() => of({ audit_id: userAuditIdToReturn }));

      // Act
      await serviceUnderTest.canActivate(route).pipe(take(1)).toPromise();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([AppRoutes.Frameworks]);
    });

    it(`should return false if current role is ${RoleEnum.It} and this page is hidden for ${RoleEnum.It}`, async () => {
      // Arrange
      route.data = { roles: [RoleEnum.Admin] };
      roleService.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: RoleEnum.It }));

      // Act
      const actual = await serviceUnderTest.canActivate(route).pipe(take(1)).toPromise();

      // Assert
      expect(actual).toBeFalse();
    });

    it(`should call navigate function with url to plugins page if current role is ${RoleEnum.It} and this page is hidden for ${RoleEnum.It}`, async () => {
      // Arrange
      route.data = { roles: [RoleEnum.Admin] };
      roleService.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: RoleEnum.It }));

      userAuditIdToReturn = 'fake-audit-id';
      roleService.getAuditIdFromUserRole = jasmine
        .createSpy('getAuditIdFromUserRole')
        .and.callFake(() => of({ audit_id: userAuditIdToReturn }));

      // Act
      await serviceUnderTest.canActivate(route).pipe(take(1)).toPromise();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([AppRoutes.Plugins]);
    });
  });

  describe('canActivateChild function', () => {
    it('should return true if current role is allowed to see this page', async () => {
      // Arrange
      route.data = { roles: [RoleEnum.Admin] };
      roleService.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: RoleEnum.Admin }));

      // Act
      const actual = await serviceUnderTest.canActivate(route).pipe(take(1)).toPromise();

      // Assert
      expect(actual).toBeTrue();
    });

    it(`should return false if current role is ${RoleEnum.Auditor} and this page is hidden for ${RoleEnum.Auditor}`, async () => {
      // Arrange
      route.data = { roles: [RoleEnum.Admin] };
      roleService.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: RoleEnum.Auditor }));

      // Act
      const actual = await serviceUnderTest.canActivate(route).pipe(take(1)).toPromise();

      // Assert
      expect(actual).toBeFalse();
    });

    it(`should call navigate function with url to audit page if current role is ${RoleEnum.Auditor} and this page is hidden for ${RoleEnum.Auditor}`, async () => {
      // Arrange
      route.data = { roles: [RoleEnum.Admin] };
      roleService.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: RoleEnum.Auditor }));

      userAuditIdToReturn = 'fake-audit-id';
      roleService.getAuditIdFromUserRole = jasmine
        .createSpy('getAuditIdFromUserRole')
        .and.callFake(() => of({ audit_id: userAuditIdToReturn }));

      // Act
      await serviceUnderTest.canActivate(route).pipe(take(1)).toPromise();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([AppRoutes.Frameworks]);
    });

    it(`should return false if current role is ${RoleEnum.It} and this page is hidden for ${RoleEnum.It}`, async () => {
      // Arrange
      route.data = { roles: [RoleEnum.Admin] };
      roleService.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: RoleEnum.It }));

      // Act
      const actual = await serviceUnderTest.canActivate(route).pipe(take(1)).toPromise();

      // Assert
      expect(actual).toBeFalse();
    });

    it(`should call navigate function with url to plugins page if current role is ${RoleEnum.It} and this page is hidden for ${RoleEnum.It}`, async () => {
      // Arrange
      route.data = { roles: [RoleEnum.Admin] };
      roleService.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: RoleEnum.It }));

      userAuditIdToReturn = 'fake-audit-id';
      roleService.getAuditIdFromUserRole = jasmine
        .createSpy('getAuditIdFromUserRole')
        .and.callFake(() => of({ audit_id: userAuditIdToReturn }));

      // Act
      await serviceUnderTest.canActivate(route).pipe(take(1)).toPromise();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([AppRoutes.Plugins]);
    });
  });
});
