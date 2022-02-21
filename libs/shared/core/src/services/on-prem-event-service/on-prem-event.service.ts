import { Injectable } from '@angular/core';
import { OnPremEventDataProperty, UserEvents } from 'core';
import { Service } from 'core/modules/data/models/domain';
import { UserEventService } from 'core/services/user-event/user-event.service';

@Injectable({
  providedIn: 'root',
})
export class OnPremEventService {
  constructor(private userEventService: UserEventService) {}

  trackNavigationFromPluginToConnectorsEvent(): void {
    this.userEventService.sendEvent(UserEvents.FROM_PLUGIN_TO_CONNECTORS);
  }

  trackHowToGuideLinkClickEvent(): void {
    this.userEventService.sendEvent(UserEvents.HOW_TO_GUIDE);
  }

  trackAddConnectorEvent(): void {
    this.userEventService.sendEvent(UserEvents.ADD_CONNECTOR);
  }

  trackDownloadVMEvent(): void {
    this.userEventService.sendEvent(UserEvents.DOWNLOAD_VM);
  }

  trackConnectorSelectEvent(pluginsAmount: number, pluginsNames: string[], connectorId: string): void {
    this.userEventService.sendEvent(UserEvents.SELECT_CONNECTOR, {
      [OnPremEventDataProperty.ConnectedPluginsAmount]: pluginsAmount,
      [OnPremEventDataProperty.PluginsNames]: pluginsNames.join(', '),
      [OnPremEventDataProperty.ConnectorId]: connectorId,
    });
  }

  trackRegenerateKeyEvent(connectorId: string): void {
    this.userEventService.sendEvent(UserEvents.REGENERATE_KEY, {
      [OnPremEventDataProperty.ConnectorId]: connectorId,
    });
  }

  trackPluginNameClickEvent(plugin: Service): void {
    this.userEventService.sendEvent(UserEvents.PLUGIN_NAME_CLICK, {
      [OnPremEventDataProperty.PluginName]: plugin.service_display_name,
    });
  }

  trackViewEvidenceClickEvent(plugin: Service): void {
    this.userEventService.sendEvent(UserEvents.VIEW_EVIDENCE_CLICK, {
      [OnPremEventDataProperty.PluginName]: plugin.service_display_name,
    });
  }

  trackTabNavigationEvent(tabName: string): void {
    this.userEventService.sendEvent(UserEvents.TAB_NAVIGATION, {
      [OnPremEventDataProperty.TabName]: tabName,
    });
  }

  trackConnectorStatusChangingEvent(connectorId: string, currentStatus: string, previousStatus: string = null): void {
    this.userEventService.sendEvent(UserEvents.CONNECTOR_STATUS_CHANGING, {
      [OnPremEventDataProperty.ConnectorId]: connectorId,
      [OnPremEventDataProperty.PreviousConnectorStatus]: previousStatus,
      [OnPremEventDataProperty.CurrentConnectorStatus]: currentStatus,
    });
  }
}
