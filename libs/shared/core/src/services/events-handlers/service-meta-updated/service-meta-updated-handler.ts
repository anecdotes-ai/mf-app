import { Injectable } from '@angular/core';
import { ServiceMetaUpdated } from 'core/models';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { EventHandler } from '../event-handler.interface';

@Injectable()
export class ServiceMetaUpdatedHandler implements EventHandler<PusherMessage> {

  // At the moment this is handled inside a regular service.
  // We don't store metadata in store (just in a service local cache).
  // However, in the future, if we have more metadata flows, this should be revisited.
  readonly messageType = PusherMessageType.ServiceMetaUpdated;

  // eslint-disable-next-line no-empty-function
  handle(message: PusherMessage<ServiceMetaUpdated>): void {}
}
