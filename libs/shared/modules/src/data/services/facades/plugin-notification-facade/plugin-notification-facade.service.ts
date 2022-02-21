import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationDefinition } from '../../../models';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { PushNotificationAction, RemoveNotificationAction, UpsertNotificationAction } from '../../../store/actions';
import { selectPluginNotificationsAfterInit } from '../../../store/selectors';
import { State } from '../../../store/state';

@Injectable()
export class PluginNotificationFacadeService {
  constructor(private store: Store<State>) {}

  getAllNotifications(): Observable<NotificationDefinition[]> {
    return this.store.pipe(selectPluginNotificationsAfterInit, shareReplay());
  }

  // As a notification id currently we can use service_id as only service notifactions are implemented
  getNotification(notification_id: string): Observable<NotificationDefinition> {
    return this.getAllNotifications().pipe(
      map((notificationsState) => notificationsState.find((n) => n.id === notification_id))
    );
  }

  removeNotification(notification_id: string): void {
    this.store.dispatch(new RemoveNotificationAction(notification_id));
  }

  addNotification(notification: NotificationDefinition): void {
    this.store.dispatch(new PushNotificationAction(notification));
  }

  updateNotification(notification: NotificationDefinition): void {
    this.store.dispatch(new UpsertNotificationAction(notification));
  }
}
