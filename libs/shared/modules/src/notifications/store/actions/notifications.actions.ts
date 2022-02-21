import { createAction, props } from '@ngrx/store';
import { Notification } from '../../models/notification';

export const NotificationActionType = {
  Load: '[Notification] Load notifications',
  Loaded: '[Notification] Notifications loaded',
  LoadLatest: '[Notificaiton] Load latest notifications',
  Update: '[Notification] Update notification',
  Updated: '[Notification] Notification updated',
  Remove: '[Notificaiton] Remove notifications',
  Removed: '[Notificaiton] Notifications Removed',
};

export const NotificationAdapterActions = {
  load: createAction(NotificationActionType.Load),
  loaded: createAction(NotificationActionType.Loaded, props<{ notifications: Notification[] }>()),
  loadLatest: createAction(NotificationActionType.LoadLatest, props<{ timestamp: string }>()),
  update: createAction(NotificationActionType.Update, props<{ id: string, notification: Notification; }>()),
  updated: createAction(NotificationActionType.Updated, props<{ id: string, changes: Notification; }>()),
  remove: createAction(NotificationActionType.Remove, props<{ id?: string }>()),
  removed: createAction(NotificationActionType.Removed, props<{ id?: string }>()),
};
