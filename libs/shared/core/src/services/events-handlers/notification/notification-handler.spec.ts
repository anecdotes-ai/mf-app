import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { PusherMessageType } from 'core';
import { UserClaims } from 'core/modules/auth-core/models';
import { AuthService } from 'core/modules/auth-core/services';
import { reducers } from 'core/modules/data/store';
import { NotificationsFacadeService } from 'core/modules/notifications/services';
import { of } from 'rxjs';
import { NotificationHandler } from './notification-handler';
import { PusherMessage } from 'core/models/pusher-message.model';
import { configureTestSuite } from 'ng-bullet';
import { PushNotification } from 'core/modules/notifications/models';

describe('NotificationHandler', () => {
  configureTestSuite();

  let serviceUnderTest: NotificationHandler;
  let notificationsFacade: NotificationsFacadeService;
  let authService: AuthService;
  let user: UserClaims;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        NotificationHandler,
        { provide: NotificationsFacadeService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(NotificationHandler);

    notificationsFacade = TestBed.inject(NotificationsFacadeService);
    notificationsFacade.loadLatest = jasmine.createSpy('loadLatest');

    authService = TestBed.inject(AuthService);
    authService.getUserAsync = jasmine.createSpy('getUserAsync').and.callFake(() => of(user).toPromise());
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    let user_id;
    let notifications_time;

    beforeEach(() => {
      // Arrange
      user_id = 'user1';
      notifications_time = '2021-12-08T19:06:38.945244';
      user = { user_id };
    });

    it('shouldnt call loadLatest method in notificationsFacade if message_object is undefined', async () => {
      // Arrange
      const message = {
        message_type: PusherMessageType.NotificationCreated,
        message_object: undefined
      };

      // Act
      await serviceUnderTest.handle(message);

      // Assert
      expect(notificationsFacade.loadLatest).not.toHaveBeenCalled();
    });

    it('shouldnt call loadLatest method in notificationsFacade if user_list is undefined', async () => {
      // Arrange
      const message = {
        message_type: PusherMessageType.NotificationCreated,
        message_object: { notifications_time }
      };

      // Act
      await serviceUnderTest.handle(message);

      // Assert
      expect(notificationsFacade.loadLatest).not.toHaveBeenCalled();
    });

    it('shouldnt call loadLatest method in notificationsFacade if userId isnt in users_list', async () => {
      // Arrange
      const message: PusherMessage<PushNotification> = {
        message_type: PusherMessageType.NotificationCreated,
        message_object: { users_list: ['bla', 'bla1'], notifications_time },
      };

      // Act
      await serviceUnderTest.handle(message);

      // Assert
      expect(notificationsFacade.loadLatest).not.toHaveBeenCalled();
    });

    it('should call loadLatest method in notificationsFacade if userId in users_list', async () => {
      // Arrange
      const message: PusherMessage<PushNotification> = {
        message_type: PusherMessageType.NotificationCreated,
        message_object: { users_list: [user_id, 'bla', 'bla1'], notifications_time },
      };
 
      // Act
      await serviceUnderTest.handle(message);
 
      // Assert
      expect(notificationsFacade.loadLatest).toHaveBeenCalledWith(notifications_time);
    });
  });
});
