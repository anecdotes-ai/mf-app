import { NotificationDefinition } from '../../models';
import { Action, createAction, props } from '@ngrx/store';

export const PluginNotificationActionType = {
  PushNotification: '[Plugin Notification] Push notification',
  UpsertNotification: '[Plugin Notification] Upsert notification',
  RemoveNotification: '[Plugin Notificaiton] Remove notification',
};

export class PushNotificationAction implements Action {
  readonly type = PluginNotificationActionType.PushNotification;

  constructor(public payload: NotificationDefinition) {}
}

export class UpsertNotificationAction implements Action {
  readonly type = PluginNotificationActionType.UpsertNotification;

  constructor(public payload: NotificationDefinition) {}
}

export class RemoveNotificationAction implements Action {
  readonly type = PluginNotificationActionType.RemoveNotification;

  constructor(public id: string) {}
}

export const PluginNotificationAdapterActions = {
  push: createAction(PluginNotificationActionType.PushNotification, props<{ payload: NotificationDefinition }>()),
  upsert: createAction(PluginNotificationActionType.UpsertNotification, props<{ payload: NotificationDefinition }>()),
  remove: createAction(PluginNotificationActionType.RemoveNotification, props<{ id: string }>()),
};
