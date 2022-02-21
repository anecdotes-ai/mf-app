import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth/auth.service';
import { AuthGuardService } from './auth-guard.service';

describe('Service: AuthGuard', () => {
  let router: Router;
  let serviceUnderTest: AuthGuardService;
  let authServiceMock: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuardService, { provide: AuthService, useValue: {} }],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(AuthGuardService);
    router = TestBed.inject(Router);
    authServiceMock = TestBed.inject(AuthService);
  });

  describe('canActivate', () => {
    let isAuthenticated: boolean;
    let urlTree: UrlTree;

    beforeEach(() => {
      authServiceMock.isAuthenticatedAsync = jasmine
        .createSpy('isAuthenticatedAsync')
        .and.callFake(() => Promise.resolve(isAuthenticated));
      router.createUrlTree = jasmine.createSpy('createUrlTree').and.callFake(() => urlTree);
      urlTree = {} as UrlTree;
    });

    describe('snapshot url does not start with /auth and user is not authenticated', () => {
      it('should return url tree that leads to sign in page', async () => {
        // Arrange
        router.routerState.snapshot = {
          url: '/fake-url',
        } as any;
        isAuthenticated = false;

        // Act
        const result = await serviceUnderTest.canActivate();

        // Assert
        expect(router.createUrlTree).toHaveBeenCalledWith(['auth', 'sign-in']);
        expect(result).toBe(urlTree as any);
      });
    });

    describe('user is authenticated', () => {
      it('should return true', async () => {
        // Arrange
        isAuthenticated = true;

        // Act
        const result = await serviceUnderTest.canActivate();

        // Assert
        expect(result).toBeTrue();
      });
    });

    describe('snapshot url starts with /auth', () => {
      it('should return true', async () => {
        // Arrange
        router.routerState.snapshot = {
          url: '/auth',
        } as any;

        // Act
        const result = await serviceUnderTest.canActivate();

        // Assert
        expect(result).toBeTrue();
      });
    });
  });
});
