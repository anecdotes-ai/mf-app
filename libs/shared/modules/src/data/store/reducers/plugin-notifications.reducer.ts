import { NotificationDefinition } from '../../models/notification-definition.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { PluginNotificationAdapterActions, PushNotificationAction, RemoveNotificationAction, UpsertNotificationAction } from '../actions';

export type PluginNotificationsState = EntityState<NotificationDefinition>;

function selectId(c: NotificationDefinition): string {
  return c.id;
}

const adapter: EntityAdapter<NotificationDefinition> = createEntityAdapter<NotificationDefinition>({
  selectId: selectId,
});

const initialState: PluginNotificationsState = adapter.getInitialState({ isLoaded: false });

const adapterReducer = createReducer(
  initialState,
  on(PluginNotificationAdapterActions.push, (state: PluginNotificationsState, action: PushNotificationAction) => {
    return adapter.addOne(action.payload, state);
  }),
  on(PluginNotificationAdapterActions.upsert, (state: PluginNotificationsState, action: UpsertNotificationAction) => {
    return adapter.upsertOne(action.payload, state);
  }),
  on(PluginNotificationAdapterActions.remove, (state: PluginNotificationsState, action: RemoveNotificationAction) => adapter.removeOne(action.id, state))
);

export function pluginNotificationsReducer(state = initialState, action: Action): PluginNotificationsState {
  return adapterReducer(state, action);
}
