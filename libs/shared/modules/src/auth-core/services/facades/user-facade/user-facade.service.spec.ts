import { ActionDispatcherService } from './../../../../data/services/action-dispatcher/action-dispatcher.service';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthService } from 'core/modules/auth-core/services';
import { of } from 'rxjs';
import { UserFacadeService } from './user-facade.service';

describe('Service: UserFacade', () => {
  let userFacadeService: UserFacadeService;
  let authService: AuthService;

  const fakeUser = {
    email: 'fake@fake.test',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFacadeService, provideMockStore(),
        { provide: ActionDispatcherService, useValue: {} },
        { provide: AuthService, useValue: {} }
    ]
    });
  });

  it('should ...', inject([UserFacadeService], (service: UserFacadeService) => {
    expect(service).toBeTruthy();
  }));

  beforeEach(() => {
    userFacadeService = TestBed.inject(UserFacadeService);
    authService = TestBed.inject(AuthService);
    authService.getUserAsync = jasmine.createSpy('getUserAsync').and.callFake(() => of(fakeUser).toPromise());
  });

  describe('sortUsersWithCurrentFirst', () => {
    it('Should sorted with the current user first', async () => {
      const fakeUsers = [
        {
          email: 'testEmail',
        },
        {
          email: 'fake@fake.test',
        },
      ];
      const sortUsers = await userFacadeService.sortUsersWithCurrentFirst(fakeUsers);

      // Assert
      expect(sortUsers[0].email).toEqual(fakeUser.email);
      expect(sortUsers[0].is_current_user).toEqual(true);
      expect(sortUsers[1].is_current_user).toEqual(false);
    });
    it('Current users not in the list', async () => {
      const fakeUsers = [
        {
          email: 'testEmail',
        },
        {
          email: 'notfake@fake.test',
        },
      ];
      const sortUsers = await userFacadeService.sortUsersWithCurrentFirst(fakeUsers);

      // Assert
      expect(sortUsers[0].email).toEqual(fakeUsers[0].email);
      expect(sortUsers[0].is_current_user).toEqual(false);
      expect(sortUsers[1].email).toEqual(fakeUsers[1].email);
      expect(sortUsers[1].is_current_user).toEqual(false);
    });
  });
});
