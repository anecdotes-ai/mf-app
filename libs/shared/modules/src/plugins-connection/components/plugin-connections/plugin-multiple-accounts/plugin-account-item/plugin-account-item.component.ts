import { PluginsDataService } from './../../../../services/plugins-data-service/plugins.data.service';
import { PluginConnectionStates } from './../../../../models/plugin-connection-states.enum';
import { PluginConnectionFacadeService } from './../../../../services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { multipleAccountsTranslationRootKey } from './../constants/translation.constants';
import { MenuAction } from 'core/modules/dropdown-menu';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiceFailedStatuses, ServiceStatusEnum, ServiceInstance } from 'core/modules/data/models/domain';

const translationKeyFactory = (key: string): string => `${multipleAccountsTranslationRootKey}.accountItem.${key}`;

@Component({
  selector: 'app-plugin-account-item',
  templateUrl: './plugin-account-item.component.html',
  styleUrls: ['./plugin-account-item.component.scss']
})
export class PluginAccountItemComponent {
  static readonly AccountItemStatusMapper = {
    [ServiceStatusEnum.INSTALLED]: {
      icon: 'status_complete',
      class: 'text-blue-50',
      translationKey: translationKeyFactory('statuses.success'),
    },
    [ServiceStatusEnum.INSTALLATIONFAILED]: {
      icon: 'status_error',
      class: 'text-pink-50',
      translationKey: translationKeyFactory('statuses.error'),
    },
    [ServiceStatusEnum.CONNECTIVITYFAILED]: {
      icon: 'status_error',
      class: 'text-pink-50',
      translationKey: translationKeyFactory('statuses.error'),
    }
  };

  get accountItemStatusMapper(): { [key: string]: { icon: string, class: string; translationKey: string } } {
    return PluginAccountItemComponent.AccountItemStatusMapper;
  }

  @Input()
  serviceInstance: ServiceInstance;

  @Output()
  editOpening = new EventEmitter<boolean>();

  threeDotsMenuActions: MenuAction<ServiceInstance>[];

  constructor(private pluginConnectionFacade: PluginConnectionFacadeService, private pluginDataService: PluginsDataService) {
    this.initThreeDotsMenu();
  }

  private initThreeDotsMenu(): void {
    this.threeDotsMenuActions = [
      {
        translationKey: this.buildTranslationKey('threeDotsMenu.edit'),
        action: async () => await this.editServiceInstance(),
      },
      {
        translationKey: this.buildTranslationKey('threeDotsMenu.viewLogs'),
        action: () => this.viewServiceInstanceLogs(),
      },
      {
        translationKeyFactory: () => {
          return this.buildTranslationKey(this.serviceInstance?.service_status !== ServiceStatusEnum.INSTALLED ? 'threeDotsMenu.remove' : 'threeDotsMenu.disconnect');
        },
        action: () => this.removeServiceInstance(),
      },
    ];
  }

  private async editServiceInstance(): Promise<void> {
    try {
      this.editOpening.emit(true);
      await this.pluginConnectionFacade.openEditServiceInstance(this.serviceInstance.service_id, this.serviceInstance.service_instance_id);
    } finally {
      this.editOpening.emit(false);
    }
  }

  private viewServiceInstanceLogs(): void {
    this.pluginDataService.showServiceInstanceLogs(this.serviceInstance.service_instance_id);
  }

  private async removeServiceInstance(): Promise<void> {
    this.pluginConnectionFacade.setState(this.serviceInstance.service_id, PluginConnectionStates.Default);
    await this.pluginConnectionFacade.loadServiceConnectionInstance(this.serviceInstance.service_id, this.serviceInstance.service_instance_id, true);
    this.pluginConnectionFacade.setState(this.serviceInstance.service_id,
       ServiceFailedStatuses.includes(this.serviceInstance.service_status) 
       ? PluginConnectionStates.RemoveServiceAccount :  PluginConnectionStates.DisconnectServiceAccount);
  }

  buildTranslationKey(key: string): string {
    return translationKeyFactory(key);
  }

}
