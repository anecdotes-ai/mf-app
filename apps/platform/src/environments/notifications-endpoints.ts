import { NotificationsEndpoints } from 'core';

export const notificationsEndpoints: NotificationsEndpoints = {
  getNotifications: '/notifications',
  deleteAllNotifications: '/notifications',
  deleteNotification: '/notifications/{{notification_id}}',
  patchNotification: '/notifications/{{notification_id}}',
};
