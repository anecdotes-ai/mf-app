import { Injectable } from '@angular/core';
import amplitude, { AmplitudeClient } from 'amplitude-js';
import { Initializable } from 'core/interfaces';
import {
  PluginEventDataPropertyNames,
  UserEventDataTypeMapping,
  UserEvents,
} from 'core/models/user-events/user-event-data.model';
import { AuthService } from 'core/modules/auth-core/services';
import { CustomerFacadeService } from 'core/modules/data/services';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { take } from 'rxjs/operators';
import { AppConfigService } from '../config/app.config.service';

export interface AmplitudeUserPropertiesEntity {
  /**
   * User account email
   */
  ['Email']: string;

  /**
   * First name + Last name
   */
  ['User name']: string;

  /**
   * Role
   */
  ['User type']: string;

  /**
   * Name of the customer organization
   */

  ['Account name']: string;

  /**
   * Organization code identifier
   */

  ['Account ID']: string;

  /**
   * Buckets of organization size
   */

  ['Account seat size']: string;

  /**
   * The Account type of the customer
   */
  ['Account type']: string;
}

@Injectable()
export class AmplitudeService implements Initializable {
  private _client: Promise<AmplitudeClient>;
  private areUserPropertiesSet: boolean;

  constructor(
    private configService: AppConfigService,
    private authService: AuthService,
    private userEventService: UserEventService,
    private customerFacade: CustomerFacadeService
  ) {}

  async init(): Promise<any> {
    this._client = Promise.resolve(this.createAmplitudeInstance());
    this.trackEvents();
  }

  private trackEvents(): void {
    this.userEventService.subscribeForAllEvents().subscribe(async (event) => {
      const serializedEventData = this.serializeSpecificEventData(event.eventType, event.eventData);
      const amplitudeInstance: AmplitudeClient = await this._client;
      const user = await this.authService.getUserAsync();

      if (user && !this.areUserPropertiesSet) {
        const customer = await this.customerFacade.getCurrentCustomer().pipe(take(1)).toPromise();
        const userProperties: AmplitudeUserPropertiesEntity = {
          Email: user.email,
          'User name': user.name,
          'User type': user.role,
          'Account type': customer.account_type,
          'Account name': customer.customer_name,
          'Account ID': null,
          'Account seat size': null,
        };

        amplitudeInstance.setUserProperties(userProperties);
        this.areUserPropertiesSet = true;
      }

      amplitudeInstance.logEvent(event.eventType, serializedEventData);
    });
  }

  serializeSpecificEventData(eventType: UserEvents, eventData: any): any {
    switch (eventType) {
      case UserEvents.PLUGINS_INNER_TAB_NAVIGATION: {
        const eventTypedData = eventData as UserEventDataTypeMapping[typeof eventType];
        return {
          ...eventTypedData,
          [PluginEventDataPropertyNames.PluginCategory]: eventTypedData[
            PluginEventDataPropertyNames.PluginCategory
          ].join(', '),
        };
      }
      default:
        return eventData;
    }
  }

  private createAmplitudeInstance(): AmplitudeClient {
    const amplitudeInstance: AmplitudeClient = amplitude.getInstance();
    amplitudeInstance.init(this.configService.config.amplitude.apiKey);
    return amplitudeInstance;
  }
}
