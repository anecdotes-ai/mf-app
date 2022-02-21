import { createSelector, State } from '@ngrx/store';
import { featureKey } from '../constants';
import { Notification, NotificationState } from '../../models';
import { NotificationsState } from '../reducers';

// ** SELECTOR FUNCTIONS ***

export function selectNotificationsState(state: State<any>): NotificationsState {
  return state[featureKey].notificationsState;
}

export const selectNotificationsEntities = (state: State<any>): Notification[] => Object.values(selectNotificationsState(state).entities);

// ** SELECTORS **

export const selectNotificationsLoaded = createSelector(selectNotificationsState, (notifications) =>
  notifications.areLoaded
);

export const selectNotificationsCount = createSelector(selectNotificationsEntities, (notifications) =>
  notifications.length
);

export const selectNotifications = createSelector(selectNotificationsEntities, (notifications) =>
  notifications
);

export const selectAnyNewNotifications = createSelector(selectNotificationsEntities, (notifications) =>
  notifications.some(n => n.state === NotificationState.New)
);
