import { Injectable } from '@angular/core';
import { ControlsFacadeService } from 'core/modules/data/services';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { EventHandler } from '../event-handler.interface';

@Injectable()
export class ControlOwnerChangedHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.ControlOwnerChanged;

  constructor(private controlFacade: ControlsFacadeService) {}

  handle(message: PusherMessage): void {
    if (message?.message_object) {
      this.controlFacade.controlOwnerUpdated(
        message.message_object.updated_control.control_id,
        message.message_object.updated_control.control_owner);
    }
  }
}
