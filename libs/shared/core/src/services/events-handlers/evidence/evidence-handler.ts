import { PusherMessage } from 'core/models/pusher-message.model';
import { PusherMessageType } from 'core/models/pusher-message-type.model';

import { EventHandler } from '../event-handler.interface';

export class EvidenceHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.Evidence;

  // eslint-disable-next-line no-empty-function
  handle(message: PusherMessage): void {}
}
