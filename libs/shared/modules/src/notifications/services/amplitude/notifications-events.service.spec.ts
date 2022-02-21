import { TestBed } from '@angular/core/testing';
import { UserEvents, NotificationsEventDataProperty } from 'core/models/user-events/user-event-data.model';
import { configureTestSuite } from 'ng-bullet';
import { mockNotifications } from '../../mocks';
import { NotificationsEventsService } from './notifications-events.service';
import { UserEventService } from 'core/services/user-event/user-event.service';

describe('NotificationsEventsService', () => {
  configureTestSuite();

  let service: NotificationsEventsService;
  let eventsService: UserEventService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UserEventService, useValue: {} }, NotificationsEventsService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(NotificationsEventsService);
    eventsService = TestBed.inject(UserEventService);

    eventsService.sendEvent = jasmine.createSpy('sendEvent');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#trackNotificationsClearAll', () => {
    it('should track event with 3 total, 1 read, 2 unread notifications ', () => {
      // Arrange
      const eventData = {
        [NotificationsEventDataProperty.Total]: mockNotifications.length,
        [NotificationsEventDataProperty.Read]: 2,
        [NotificationsEventDataProperty.Unread]: 1,
      };

      // Act
      service.trackNotificationsClearAll(mockNotifications);

      // Assert
      expect(eventsService.sendEvent).toHaveBeenCalledWith(UserEvents.NOTIFICATION_REMOVE_ALL, eventData);
    });
  });
});
