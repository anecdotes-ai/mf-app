import { NotificationResourceType } from './notification-resource.type';

export interface NotificationData {
  /** resource_type - The type of the resource this notifications is related to*/
  resource_type?: NotificationResourceType;
  /** resource_id - The id of the related resource of the notificartion */
  resource_id?: string;
  /** can contain bunch of extra properties */
  [key: string]: any;
}
