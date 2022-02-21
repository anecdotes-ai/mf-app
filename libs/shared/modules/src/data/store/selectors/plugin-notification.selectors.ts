import { State } from '../state';
import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { NotificationDefinition } from '../../models/notification-definition.model';

// ** SELECTOR FUNCTIONS ***

export const selectPluginNotificationsEntities = (state: State): Dictionary<NotificationDefinition> => state.pluginsNotificationsState.entities;

// ** SELECTORS **

export const selectPluginNotifications = createSelector(selectPluginNotificationsEntities, (notificationsEntities) =>
  Object.values(notificationsEntities)
);
