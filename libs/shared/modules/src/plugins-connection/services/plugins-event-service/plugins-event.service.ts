import { PluginEventDataPropertyNames, UserEvents } from 'core/models';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { Injectable } from '@angular/core';
import { Service, ServiceStatusEnum } from 'core/modules/data/models/domain';
import { PluginFacadeService } from 'core/modules/data/services';
import { take } from 'rxjs/operators';

@Injectable()
export class PluginsEventService {
  constructor(private userEventService: UserEventService, private pluginFacade: PluginFacadeService) {}

  trackConnectPluginClick(service: Service): void {
    this.userEventService.sendEvent(UserEvents.CONNECT_PLUGIN, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
    });
  }

  trackReconnectPluginClick(service: Service, changedFieldsArray: { [key: string]: any }): void {
    const changedFields = Object.keys(changedFieldsArray).join(', ');
    this.userEventService.sendEvent(UserEvents.PLUGIN_RECONNECT, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.ChangedField]: changedFields,
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
    });
  }

  trackDisconnectPluginClick(service: Service): void {
    this.userEventService.sendEvent(UserEvents.PLUGIN_DISCONNECT, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.PluginType]: service.service_type.toLowerCase(),
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
    });
  }

  trackPluginConnectionResult(event: UserEvents, service: Service): void {
    this.userEventService.sendEvent(event, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
    });
  }

  async trackEvidenceCollectionResult(event: UserEvents, pluginId: string): Promise<void> {
    const plugin = await this.pluginFacade.getServiceById(pluginId).pipe(take(1)).toPromise();
    this.userEventService.sendEvent(event, {
      [PluginEventDataPropertyNames.PluginName]: plugin.service_display_name,
      [PluginEventDataPropertyNames.PluginCategory]: plugin.service_families,
    });
  }

  trackRunOnDemandClick(service: Service): void {
    this.userEventService.sendEvent(UserEvents.PLUGIN_RUN_ON_DEMAND, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
    });
  }

  trackEditPluginClick(service: Service): void {
    this.userEventService.sendEvent(UserEvents.PLUGIN_EDIT_FORM, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
    });
  }

  trackCancelEditPluginClick(service: Service): void {
    this.userEventService.sendEvent(UserEvents.PLUGIN_CANCEL_EDIT_FORM, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
    });
  }

  trackHowToConnectClick(service: Service): void {
    this.userEventService.sendEvent(UserEvents.PLUGIN_HOW_TO_CONNECT, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.PluginType]: service.service_type.toLowerCase(),
      [PluginEventDataPropertyNames.PluginConnected]: service.service_status === ServiceStatusEnum.INSTALLED,
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
    });
  }

  trackTabNavigation(service: Service, tabName: string): void {
    this.userEventService.sendEvent(UserEvents.PLUGINS_INNER_TAB_NAVIGATION, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.TabName]: tabName,
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
    });
  }

  trackPluginClick(service: Service): void {
    this.userEventService.sendEvent(UserEvents.PLUGIN_SELECT_PLUGIN_ON_MARKETPLACE, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
      [PluginEventDataPropertyNames.PluginConnected]: service.service_status === ServiceStatusEnum.INSTALLED,
    });
  }

  trackViewEvidenceClick(service: Service): void {
    this.userEventService.sendEvent(UserEvents.VIEW_EVIDENCE, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
    });
  }

  trackUpdatePermissionClick(service: Service): void {
    this.userEventService.sendEvent(UserEvents.UPDATE_PERMISSIONS, {
      [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
    });
  }
}
