import { NotificationData, NotificationState } from './';

export interface Notification {
  /** The id of the notification*/
  id: string;
  /** The ueer id to whom this notification belongs to */
  user_id?: string;
  /** When was the notification created */
  creation_time?: string;
  /** The last time ths notification was changed*/
  last_modified_time?: string;
  /** The state of the notification, was it read or not yet */
  state?: NotificationState;
  /** The notification type, the way it is defined in monday */
  type?: string;
  /** The content of the notification, this text will be displayed to the user */
  content?: string;
  /** Extra data related to the notification, structure can change from notification to notification*/
  data?: NotificationData;
}
