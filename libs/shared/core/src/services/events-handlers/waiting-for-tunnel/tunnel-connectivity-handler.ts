import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { Injectable } from '@angular/core';
import { MANUAL } from 'core/modules/data/constants';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { EventHandler } from '../event-handler.interface';
import { TunnelConnectivityResult } from 'core/models/tunnel-connectivity-result';

@Injectable()
export class TunnelConnectivityHandler implements EventHandler<PusherMessage<TunnelConnectivityResult>> {
  readonly messageType = PusherMessageType.TunnelConnectivity;

  constructor(
    private pluginConnectionFacade: PluginConnectionFacadeService,
  ) {}

  handle(message: PusherMessage<TunnelConnectivityResult>): void {
    if (message.message_object && message.message_object.service_id !== MANUAL) {
      this.pluginConnectionFacade.handleTunnelConnectivityResult(message.message_object);
    }
  }
}
