import { Injectable } from '@angular/core';
import { ConnectorLog } from 'core/models';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { PluginFacadeService } from 'core/modules/data/services';
import { take } from 'rxjs/operators';
import { EventHandler } from '../event-handler.interface';

@Injectable()
export class ConnectorLogService implements EventHandler<PusherMessage<ConnectorLog>> {
  readonly messageType: string = PusherMessageType.ConnectorLog;

  constructor(private pluginFacadeService: PluginFacadeService) { }

  async handle(message: PusherMessage<ConnectorLog>): Promise<any> {
    const service_id = message.message_object.connector_id;
    const serviceInstanceId = message.message_object.service_instance_id;
    const areLogsLoaded = await this.pluginFacadeService.areLogsLoadedForPlugin(service_id, serviceInstanceId).pipe(take(1)).toPromise();

    if (areLogsLoaded) {
      this.pluginFacadeService.addPluginLogs(service_id, serviceInstanceId, [
        {
          run_id: message.message_object.run_id,
          message: message.message_object.message,
          severity: message.message_object.severity,
          timestamp: message.message_object.timestamp,
        },
      ]);
    }
  }
}
