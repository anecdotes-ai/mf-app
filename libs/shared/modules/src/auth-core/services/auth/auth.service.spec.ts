import { AuthEventService } from './auth-event-service/auth-event.service';
import { inject, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import firebase from 'firebase';
import { map } from 'rxjs/operators';
import { WindowHelperService } from 'core/services';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { UserClaims } from '../../models';
import { FirebaseWrapperService } from '../firebase-wrapper/firebase-wrapper.service';
import { TenantFacadeService } from '../facades/tenant-facade/tenant-facade.service';

describe('Service: AuthService', () => {
  let authService: AuthService;
  let angularFireAuthMock: AngularFireAuth;
  let userClaims: UserClaims;
  let fakeFirebaseUser: firebase.User;
  let windowHelperMock: WindowHelperService;
  let authEventService: AuthEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: AngularFireAuth,
          useValue: {
            authState: of({}).pipe(map(() => fakeFirebaseUser)),
          },
        },
        { provide: WindowHelperService, useValue: {} },
        { provide: AuthEventService, useValue: {} },
        { provide: UserEventService, useValue: {} },
        { provide: FirebaseWrapperService, useValue: {} },
        { provide: TenantFacadeService, useValue: {} },
      ],
    });
  });

  beforeEach(() => {
    authService = TestBed.inject(AuthService);
    userClaims = {} as any;
    angularFireAuthMock = TestBed.inject(AngularFireAuth);
    angularFireAuthMock.signOut = jasmine.createSpy('signOut').and.callFake(() => Promise.resolve());
    fakeFirebaseUser = {} as any;
    fakeFirebaseUser.getIdTokenResult = jasmine.createSpy('getIdTokenResult').and.callFake(() =>
      Promise.resolve({
        claims: userClaims,
      })
    );
    windowHelperMock = TestBed.inject(WindowHelperService);
    windowHelperMock.redirectToOrigin = jasmine.createSpy('redirectToOrigin');

    authEventService = TestBed.inject(AuthEventService);
    authEventService.trackLogout = jasmine.createSpy('trackLogout');
    authEventService.trackLogin = jasmine.createSpy('trackLogin');

  });

  it('should ...', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it('should return user from getIdTokenResult()', async () => {
    // Arrange
    // Act
    const actualUserClaims = await authService.getUserAsync();

    // Assert
    expect(actualUserClaims).toBe(userClaims);
  });

  it('should call getIdTokenResult once for multiple calls of getUserAsync() and return the same user claims', async () => {
    // Arrange
    const results: { [key: string]: any }[] = [];
    const tasks = [
      authService.getUserAsync(),
      authService.getUserAsync(),
      authService.getUserAsync(),
      authService.getUserAsync(),
      authService.getUserAsync(),
      authService.getUserAsync(),
    ];

    // Act
    for (const task of tasks) {
      results.push(await task);
    }

    // Assert
    expect(fakeFirebaseUser.getIdTokenResult).toHaveBeenCalledTimes(1);
    expect(results.length).toBe(tasks.length);
    results.forEach((user) => expect(user).toBe(userClaims));
  });

  describe('signOutAsync', () => {
    it('should call signOut()', async () => {
      // Arrange
      // Act
      await authService.signOutAsync();

      // Assert
      expect(angularFireAuthMock.signOut).toHaveBeenCalled();
    });

    it('should call trackLogout', async () => {
      // Arrange
      // Act
      await authService.signOutAsync();

      // Assert
      expect(authEventService.trackLogout).toHaveBeenCalled();
    });

    it('should call redirectToOrigin', async () => {
      // Arrange
      // Act
      await authService.signOutAsync();

      // Assert
      expect(windowHelperMock.redirectToOrigin).toHaveBeenCalled();
    });
  });
});
