import { WindowHelperService } from './../../window-helper/window-helper.service';
import { inject, TestBed } from '@angular/core/testing';
import { UserProviderService } from './user-provider.service';
import { AuthService } from 'core/modules/auth-core/services/auth/auth.service';
import { UserClaims } from 'core/modules/auth-core/models/user-claims';

describe('Service: UserProvider', () => {
  let userProviderService: UserProviderService;
  let userClaims: UserClaims;
  let windowHelper: WindowHelperService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserProviderService, { provide: AuthService, useValue: {} }, { provide: WindowHelperService, useValue: {} }],
    });
  });

  beforeEach(() => {
    userProviderService = TestBed.inject(UserProviderService);
    authService = TestBed.inject(AuthService);
    windowHelper = TestBed.inject(WindowHelperService);
    userClaims = { email: 'user_email' } as UserClaims;
    authService.getUserAsync = jasmine.createSpy('getUser').and.returnValue(Promise.resolve(userClaims));
  });

  it('should ...', inject([UserProviderService], (service: UserProviderService) => {
    expect(service).toBeTruthy();
  }));

  it('should return user from OktaAuthService.getUser()', async () => {
    // Arrange
    // Act
    const actualUserClaims = await userProviderService.getUserAsync();

    // Assert
    expect(actualUserClaims).toBe(userClaims);
  });

  it('should call OktaAuthService.getUser() once for multiple calls of getUserAsync() and return the same user claims', async () => {
    // Arrange
    const results: UserClaims[] = [];
    const tasks = [
      userProviderService.getUserAsync(),
      userProviderService.getUserAsync(),
      userProviderService.getUserAsync(),
      userProviderService.getUserAsync(),
      userProviderService.getUserAsync(),
      userProviderService.getUserAsync(),
    ];

    // Act
    for (const task of tasks) {
      results.push(await task);
    }

    // Assert
    expect(authService.getUserAsync).toHaveBeenCalledTimes(1);
    expect(results.length).toBe(tasks.length);
    results.forEach((user) => expect(user).toBe(userClaims));
  });

  describe('Is new user data setting to local storage', () => {
    let getItemSpy: jasmine.Spy<jasmine.Func>;
    let setItemSpy: jasmine.Spy<jasmine.Func>;

    beforeEach(() => {
      getItemSpy = jasmine.createSpy('getItem');
      setItemSpy = jasmine.createSpy('setItemSpy');
    });

    describe('setCurrentUserIsOnboarded', () => {
      it('should set user email to local storage if there was not settled its email', async () => {
        // Arrange
        windowHelper.getWindow = jasmine.createSpy('getWindow').and.returnValue({ localStorage: { setItem: setItemSpy } });

        // Act
        await userProviderService.setCurrentUserAsKnown();

        // Assert
        expect(setItemSpy).toHaveBeenCalledWith(userClaims.email, 'known_user');
      });
    });

    describe('isNewUser', () => {
      it('should return false is current user\'s email exists in localStorage', async () => {
        // Arrange
        getItemSpy.and.returnValue(JSON.stringify([userClaims.email]));
        windowHelper.getWindow = jasmine.createSpy('getWindow').and.returnValue({ localStorage: { getItem: getItemSpy, setItem: setItemSpy } });

        // Act
        const isNew = await userProviderService.isUserNew();

        // Assert
        expect(isNew).toBeFalse();
      });

      it('should return true if user email is not setteled to local storage', async () => {
        // Arrange
        getItemSpy.and.returnValue(null);
        windowHelper.getWindow = jasmine.createSpy('getWindow').and.returnValue({ localStorage: { getItem: getItemSpy, setItem: setItemSpy } });

        // Act
        const isNew = await userProviderService.isUserNew();

        // Assert
        expect(isNew).toBeTrue();
      });
    });
  });
});
