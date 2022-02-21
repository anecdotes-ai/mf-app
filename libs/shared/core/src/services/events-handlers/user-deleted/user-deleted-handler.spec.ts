import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { MessageBusService } from 'core/services';
import { RoleService } from 'core/modules/auth-core/services';
import { reducers } from 'core/modules/data/store';
import { UserRemovedAction } from 'core/modules/auth-core/store';
import { UserDeletedHandler } from './user-deleted-handler';

describe('UserDeletedHandler', () => {
  let serviceUnderTest: UserDeletedHandler;
  let mockStore: MockStore;
  let roleService: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        provideMockStore(),
        UserDeletedHandler,
        { provide: MessageBusService, useValue: {} },
        { provide: RoleService, useValue: {} },
      ],
    });
    serviceUnderTest = TestBed.inject(UserDeletedHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');

    roleService = TestBed.inject(RoleService);
    roleService.mapRole = jasmine.createSpy('mapRole').and.callFake((role) => role);
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    it('should dispatch UserCreatedAction if message_object is defined', () => {
      // Arrange
      const user_email = 'some-user_email';
      const message = {
        message_type: PusherMessageType.UserDeleted,
        message_object: { user_email },
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new UserRemovedAction({ email: user_email }));
    });
  });
});
