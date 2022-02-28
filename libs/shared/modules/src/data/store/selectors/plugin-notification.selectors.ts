import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { NotificationDefinition } from '../../models/notification-definition.model';
import { dataFeatureSelector } from './feature.selector';

// ** SELECTOR FUNCTIONS ***

const SelectPluginNotificationState = createSelector(dataFeatureSelector, dataFeatureState => dataFeatureState.pluginsNotificationsState);
const SelectPluginNotificationsEntities = createSelector(SelectPluginNotificationState, (pluginsNotificationsState): Dictionary<NotificationDefinition> => pluginsNotificationsState.entities);

// ** SELECTORS **

const SelectPluginNotifications = createSelector(SelectPluginNotificationsEntities, (notificationsEntities) =>
  Object.values(notificationsEntities)
);

export const PluginNotificationSelectors = {
  SelectPluginNotificationsEntities,
  SelectPluginNotifications,
  SelectPluginNotificationState
};
