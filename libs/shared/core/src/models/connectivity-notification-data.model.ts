import { ServiceTypeEnum } from 'core/modules/data/models/domain';
import { NotificationTypes } from 'core/modules/data/models';

export interface PluginInstallationNotificationDataSettings {
  isInProgress: boolean;
  displaySecondaryContent: boolean;
  success?: boolean;
}

export interface PluginInstallationNotificationData extends PluginInstallationNotificationDataSettings {
  service_id: string;
  service_display_name: string;
  service_type: ServiceTypeEnum;
  notificationType: NotificationTypes.CONNECTIVITY | NotificationTypes.COLLECTION;
}

export interface ConnectivityNotificationData extends PluginInstallationNotificationData {
  connectivityMessageData: {
    status: boolean;
  };
}

export interface CollectionNotificationData extends PluginInstallationNotificationData {
  collectionMessageData: {
    status: boolean;
    total_evidence: number;
    collected_evidence: number;
  };
}
