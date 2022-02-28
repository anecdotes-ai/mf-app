import { Injectable } from '@angular/core';
import { UserEvents, MultiAccountsDataProperty } from 'core/models';
import { UserEventService } from 'core/services/user-event/user-event.service';

@Injectable()
export class MultiAccountsEventService {

  constructor(
    private userEventService: UserEventService,
  ) {}

  async trackMultiAccountWithPluginName(event: UserEvents, plugin_name: string): Promise<void> {
    this.userEventService.sendEvent(
      event,
      {
        [MultiAccountsDataProperty.PluginName]: plugin_name,
      }
    );
  }

  async trackEditAccount(plugin_name: string, plugin_alias?: string): Promise<void> {
    this.userEventService.sendEvent(
      UserEvents.EDIT_ACCOUNT,
      {
        [MultiAccountsDataProperty.PluginName]: plugin_name,
        [MultiAccountsDataProperty.AccountAlias]: plugin_alias ? "changed" : "not changed",
      }
    );
  }

  async trackConnectAccounts(plugin_name: string, number_of_connected: number, number_of_succeeded?: number, total_connected?: number): Promise<void> {
    this.userEventService.sendEvent(
      UserEvents.CONNECT_ACCOUNTS,
      {
        [MultiAccountsDataProperty.PluginName]: plugin_name,
        [MultiAccountsDataProperty.NumberOfConnectedAccounts]: number_of_connected,
        [MultiAccountsDataProperty.NumberOfSucceededConnections]: number_of_succeeded,
        [MultiAccountsDataProperty.TotalConnectedAccounts]: total_connected,
      }
    );
  }

}
