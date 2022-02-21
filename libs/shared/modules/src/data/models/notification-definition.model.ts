import { Type } from '@angular/core';

export enum NotificationTypes {
  CONNECTIVITY,
  COLLECTION,
}

export interface NotificationDefinition {
  id: string;
  componentType?: Type<any>;
  notificationType?: NotificationTypes;
  success?: boolean;
  displayed?: boolean;
  inputs?: {
    [key: string]: any;
  };
}

export const NotificationInputNames = {
  notificationData: 'notificationData',
};

export interface NotificationConstructionData<TData, TSettings> {
  data: TData;
  settings?: TSettings;
  displayed?: boolean;
}
