import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { UserCreatedAction } from 'core/modules/auth-core/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { MessageBusService } from 'core/services';
import { RoleService } from 'core/modules/auth-core/services';
import { reducers } from 'core/modules/data/store';
import { UserAddedHandler } from './user-added-handler';

describe('UserAddedHandler', () => {
  let serviceUnderTest: UserAddedHandler;
  let mockStore: MockStore;
  let roleService: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        provideMockStore(),
        UserAddedHandler,
        { provide: MessageBusService, useValue: {} },
        { provide: RoleService, useValue: {} },
      ],
    });
    serviceUnderTest = TestBed.inject(UserAddedHandler);

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
      const user = {
        audit_id: 'some-audit-id',
        email: 'some-email',
        first_name: 'some-first-name',
        last_name: 'some-last-name',
        role: 'some-role' as RoleEnum,
        status: 'some-status',
      };
      const message = {
        message_type: PusherMessageType.UserAdded,
        message_object: user,
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new UserCreatedAction(user));
    });
  });
});
