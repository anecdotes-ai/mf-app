import { ServiceAdapterActions } from 'core/modules/data/store/actions/services.actions';
import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MANUAL } from 'core/modules/data/constants';
import { ConnectivityResult } from 'core/models/connectivity-result.model';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { UserEvents } from 'core/models/user-events/user-event-data.model';
import { LoadSpecificServiceAction } from 'core/modules/data/store/actions';
import { ServiceSelectors } from 'core/modules/data/store';
import { filter, map, take } from 'rxjs/operators';
import { EventHandler } from '../event-handler.interface';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';

@Injectable()
export class ConnectivityHandler implements EventHandler<PusherMessage<ConnectivityResult>> {
  readonly messageType = PusherMessageType.Connectivity;

  constructor(
    private store: Store,
    private pluginConnectionFacade: PluginConnectionFacadeService,
    private pluginEventService: PluginsEventService
  ) { }

 handle(message: PusherMessage<ConnectivityResult>): void {
    if (message.message_object && message.message_object.service_id !== MANUAL) {
      const newRefPusherMessageObj = {...message.message_object};
      this.trackUserEvent(newRefPusherMessageObj);
      this.pluginConnectionFacade.handlePluginConnectivityResult(newRefPusherMessageObj);

      this.store.dispatch(ServiceAdapterActions.serviceConnectivityHandling({
        service_id: newRefPusherMessageObj.service_id,
        message_status: newRefPusherMessageObj.status,
        service_instance_id: newRefPusherMessageObj.service_instance_id,
        service_instance_status: newRefPusherMessageObj.service_status
      }));
    }
  }

  private async trackUserEvent(messageObject: ConnectivityResult): Promise<void> {
    const servicePulled = await this.store
      .select(ServiceSelectors.SelectServiceState)
      .pipe(
        map((state) => {
          return state.initialized || !!state.entities[messageObject.service_id];
        }),
        take(1)
      )
      .toPromise();

    this.store
      .select(ServiceSelectors.SelectServiceState)
      .pipe(
        filter((state) => !!state?.entities && !!state?.entities[messageObject.service_id]?.service),
        map((state) => state.entities[messageObject.service_id].service),
        take(1)
      )
      .subscribe((service) => {
        const connectionEvent = messageObject.status
          ? UserEvents.PLUGIN_CONNECTION_SUCCEEDED
          : UserEvents.PLUGIN_CONNECTION_FAILED;
        this.pluginEventService.trackPluginConnectionResult(connectionEvent, service);
      });

    if (!servicePulled) {
      this.store.dispatch(
        new LoadSpecificServiceAction({
          service_id: messageObject.service_id,
        })
      );
    }
  }
}
