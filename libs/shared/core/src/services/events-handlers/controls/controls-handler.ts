import { PusherMessage } from 'core/models/pusher-message.model';
import { PusherMessageType } from 'core/models/pusher-message-type.model';

import { EventHandler } from '../event-handler.interface';

export class ControlsHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.Controls;

  handle(message: PusherMessage): void {}
}
