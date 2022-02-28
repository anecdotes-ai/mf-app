import { ServiceTypeEnum } from 'core/modules/data/models/domain';
import { PluginFacadeService } from 'core/modules/data/services/facades/plugin-facade/plugin-facade.service';
import { Injectable } from '@angular/core';
import {
  CollectionNotificationData,
  ConnectivityNotificationData,
  PluginInstallationNotificationDataSettings,
} from 'core/models/connectivity-notification-data.model';
import { Store } from '@ngrx/store';
import { ConnectivityNotificationComponent, CollectionNotificationComponent } from 'core/components/notifications';
import { CollectionResult } from 'core/models/collection-result.model';
import { ConnectivityResult } from 'core/models/connectivity-result.model';
import {
  NotificationConstructionData,
  NotificationDefinition,
  NotificationTypes,
  NotificationInputNames,
} from 'core/modules/data/models';
import { UpsertNotificationAction } from 'core/modules/data/store/actions';
import { map, take } from 'rxjs/operators';
import { TunnelConnectivityResult } from 'core/models/tunnel-connectivity-result';

@Injectable()
export class PluginNotificationSenderService {
  constructor(private store: Store, private pluginFacade: PluginFacadeService) {}

  sendConnectionStartedNotification(data: ConnectivityResult): any {
    const notificationDef = this.constructConnectivityNotificationDefinition({
      data,
      displayed: true,
      settings: { displaySecondaryContent: false, isInProgress: true, success: null },
    });
    this.store.dispatch(new UpsertNotificationAction(notificationDef));
  }

  sendTunnelFailedNotification(data: TunnelConnectivityResult): any {
    const notificationDef = this.constructConnectivityNotificationDefinition({
      data,
      displayed: false,
      settings: { displaySecondaryContent: false, isInProgress: false, success: null },
    });
    this.store.dispatch(new UpsertNotificationAction(notificationDef));
  }

  sendConnectionFailedNotification(data: ConnectivityResult): any {
    const notificationDef = this.constructConnectivityNotificationDefinition({
      data,
      displayed: true,
      settings: { displaySecondaryContent: true, isInProgress: false, success: false },
    });
    this.store.dispatch(new UpsertNotificationAction(notificationDef));
  }

  sendConnectionStatusUnknownNotification(data: ConnectivityResult): any {
    const notificationDef = this.constructConnectivityNotificationDefinition({
      data,
      displayed: true,
      settings: { displaySecondaryContent: true, isInProgress: false, success: null },
    });
    this.store.dispatch(new UpsertNotificationAction(notificationDef));
  }

  async sendCollectionStartedNotification(data: CollectionResult): Promise<any> {
    const notificationDef = await this.constructCollectionNotificationDefinition({
      data,
      displayed: true,
      settings: { displaySecondaryContent: false, isInProgress: true, success: null },
    });
    this.store.dispatch(new UpsertNotificationAction(notificationDef));
  }

  async sendCollectionFailedNotification(data: CollectionResult): Promise<any> {
    const notificationDef = await this.constructCollectionNotificationDefinition({
      data,
      displayed: true,
      settings: {
        isInProgress: false,
        displaySecondaryContent: true,
        success: false,
      },
    });
    this.store.dispatch(new UpsertNotificationAction(notificationDef));
  }

  async sendCollectionSuccessNotification(data: CollectionResult): Promise<any> {
    const notificationDef = await this.constructCollectionNotificationDefinition({
      data,
      displayed: true,
      settings: {
        isInProgress: false,
        displaySecondaryContent: true,
        success: true,
      },
    });
    this.store.dispatch(new UpsertNotificationAction(notificationDef));
  }

  private constructConnectivityNotificationDefinition({
    data,
    settings,
    displayed,
  }: NotificationConstructionData<
    ConnectivityResult,
    PluginInstallationNotificationDataSettings
  >): NotificationDefinition {
    const notificationTypeMetadata = NotificationTypes.CONNECTIVITY;

    const connectivityData: ConnectivityNotificationData = {
      service_id: data.service_id,
      service_display_name: data.service_display_name,
      service_type: data.service_type,
      isInProgress: settings.isInProgress,
      displaySecondaryContent: settings.displaySecondaryContent,
      success: settings.success,
      notificationType: notificationTypeMetadata,
      connectivityMessageData: {
        status: data.status,
      },
    };

    const notificationDef: NotificationDefinition = {
      id: data.service_id,
      componentType: ConnectivityNotificationComponent,
      notificationType: notificationTypeMetadata,
      success: settings.success,
      displayed,
      inputs: {
        [NotificationInputNames.notificationData]: connectivityData,
      },
    };

    return notificationDef;
  }

  private async constructCollectionNotificationDefinition({
    data,
    settings,
    displayed,
  }: NotificationConstructionData<CollectionResult, PluginInstallationNotificationDataSettings>): Promise<
    NotificationDefinition
  > {
    const notificationTypeMetadata = NotificationTypes.COLLECTION;

    const collectionData: CollectionNotificationData = {
      service_id: data.service_id,
      service_type: await this.serviceType(data.service_id),
      isInProgress: settings.isInProgress,
      displaySecondaryContent: settings.displaySecondaryContent,
      notificationType: notificationTypeMetadata,
      service_display_name: data.service_name,
      success: settings.success,
      collectionMessageData: {
        status: data.status,
        total_evidence: data.total_evidence,
        collected_evidence: data.collected_evidence,
      },
    };

    const notificationDef: NotificationDefinition = {
      id: data.service_id,
      componentType: CollectionNotificationComponent,
      notificationType: notificationTypeMetadata,
      success: settings.success,
      displayed,
      inputs: {
        [NotificationInputNames.notificationData]: collectionData,
      },
    };

    return notificationDef;
  }

  private async serviceType(serviceId: string): Promise<ServiceTypeEnum> {
    return await this.pluginFacade
      .getServiceById(serviceId)
      .pipe(
        map((s) => s.service_type),
        take(1)
      )
      .toPromise();
  }
}
