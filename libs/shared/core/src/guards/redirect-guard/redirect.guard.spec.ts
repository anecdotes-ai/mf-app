import { async, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AppRoutes } from 'core';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { RoleService } from 'core/modules/auth-core/services';
import { CustomerFacadeService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { RedirectGuard } from './redirect.guard';

describe('RedirectGuard', () => {
  let serviceUnderTest: RedirectGuard;
  let customerFacade: CustomerFacadeService;
  let roleService: RoleService;
  let router: Router;

  let isOnBoarded: boolean;
  let role: { role: RoleEnum };
  let createUrlTreeReturnValue: any;
  let fakeActivatedRoute: ActivatedRouteSnapshot;
  let fakeRouterStateSnapshot: RouterStateSnapshot;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        RedirectGuard,
        { provide: Router, useValue: {} },
        { provide: CustomerFacadeService, useValue: {} },
        { provide: RoleService, useValue: {} },
      ],
    });
  }));

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(RedirectGuard);
    customerFacade = TestBed.inject(CustomerFacadeService);
    roleService = TestBed.inject(RoleService);
    router = TestBed.inject(Router);

    customerFacade.getCurrentCustomerIsOnboarded = jasmine
      .createSpy('getCurrentCustomerIsOnboarded')
      .and.callFake(() => of(isOnBoarded));
    customerFacade.markCustomerAsOnboarded = jasmine.createSpy('markCustomerAsOnboarded');
    customerFacade.getCurrentCustomer = jasmine.createSpy('getCurrentCustomer').and.callFake(() => of({}));
    roleService.getCurrentUserRole = jasmine.createSpy('getCurrentUserRole').and.callFake(() => of(role));
    router.createUrlTree = jasmine.createSpy('createUrlTree').and.callFake(() => createUrlTreeReturnValue);
    fakeActivatedRoute = {} as any;
    fakeRouterStateSnapshot = {} as any;
    role = { role: RoleEnum.Admin };
  });

  describe('canActivate function', () => {
    describe('snapshot.url is "/" and user is new', () => {
      beforeEach(() => {
        isOnBoarded = false;
        fakeRouterStateSnapshot.url = '/';
      });

      it('should call createUrlTree with welcome page url', async () => {
        // Arrange
        // Act
        await serviceUnderTest.canActivate(fakeActivatedRoute, fakeRouterStateSnapshot).toPromise();

        // Assert
        expect(router.createUrlTree).toHaveBeenCalledWith([AppRoutes.WelcomePage]);
      });

      it('should return value from createUrlTree', async () => {
        // Arrange
        // Act
        const actualValue = await serviceUnderTest.canActivate(fakeActivatedRoute, fakeRouterStateSnapshot).toPromise();

        // Assert
        expect(actualValue).toBe(createUrlTreeReturnValue);
      });
    });

    describe('customer is onboarded', () => {
      beforeEach(() => {
        isOnBoarded = true;
      });

      it(`should return true`, async () => {
        // Arrange
        // Act
        const actualValue = await serviceUnderTest.canActivate(fakeActivatedRoute, fakeRouterStateSnapshot).toPromise();
        // Assert
        expect(actualValue).toBeTrue();
      });
    });

    describe('customer is not onboarded', () => {
      beforeEach(() => {
        isOnBoarded = false;
      });

      it(`should call createUrlTree function with url to welcome page`, async () => {
        // Arrange
        // Act
        await serviceUnderTest.canActivate(fakeActivatedRoute, fakeRouterStateSnapshot).toPromise();

        // Assert
        expect(router.createUrlTree).toHaveBeenCalledWith([AppRoutes.WelcomePage]);
      });

      it(`should return value from router.createUrlTree for first call`, async () => {
        // Arrange
        createUrlTreeReturnValue = {};

        // Act
        const actualValue = await serviceUnderTest.canActivate(fakeActivatedRoute, fakeRouterStateSnapshot).toPromise();

        // Assert
        expect(actualValue).toBe(createUrlTreeReturnValue);
      });
    });

    describe('customer is not onboarded', () => {
      beforeEach(() => {
        isOnBoarded = false;
        role = { role: RoleEnum.It };
      });

      it(`should call markCustomerAsOnboarded if this is it user`, async () => {
        // Arrange
        // Act
        await serviceUnderTest.canActivate(fakeActivatedRoute, fakeRouterStateSnapshot).toPromise();
  
        // Assert
        expect(customerFacade.markCustomerAsOnboarded).toHaveBeenCalled();
      });
    });
  });
});
