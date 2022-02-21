import { Injectable } from '@angular/core';
import { NotificationResourceType, NotificationState, Notification } from '../../models';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { NotificationEventDataProperty, UserEvents, NotificationsEventDataProperty } from 'core/models/user-events/user-event-data.model';

@Injectable()
export class NotificationsEventsService {
  constructor(private userEventService: UserEventService) {}

  trackNotificationClick(
    notificationType: string,
    path: string,
    resourceType: NotificationResourceType,
    state: NotificationState
  ): void {
    const eventData = {
      [NotificationEventDataProperty.NotificationType]: notificationType,
      [NotificationEventDataProperty.Content]: path,
      [NotificationEventDataProperty.Resource]: resourceType,
      [NotificationEventDataProperty.State]: state,
    };

    this.userEventService.sendEvent(UserEvents.NOTIFICATION_CLICK, eventData);
  }

  trackNotificationRemoval(
    notificationType: string,
    path: string,
    resourceType: NotificationResourceType,
    state: NotificationState
  ): void {
    const eventData = {
      [NotificationEventDataProperty.NotificationType]: notificationType,
      [NotificationEventDataProperty.Content]: path,
      [NotificationEventDataProperty.Resource]: resourceType,
      [NotificationEventDataProperty.State]: state,
    };

    this.userEventService.sendEvent(UserEvents.NOTIFICATION_REMOVE, eventData);
  }

  trackNotificationsClearAll(allNotifications: Notification[]): void {
    const total = allNotifications.length;
    const unread = allNotifications.filter(n => n.state === NotificationState.New).length;
    const read = allNotifications.filter(n => n.state === NotificationState.Seen).length;

    const eventData = {
      [NotificationsEventDataProperty.Total]: total,
      [NotificationsEventDataProperty.Read]: read,
      [NotificationsEventDataProperty.Unread]: unread,
    };

    this.userEventService.sendEvent(UserEvents.NOTIFICATION_REMOVE_ALL, eventData);
  }
}
