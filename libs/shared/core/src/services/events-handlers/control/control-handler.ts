import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { Control } from 'core/modules/data/models/domain';
import { UpdateControlAction } from 'core/modules/data/store/actions';
import { EventHandler } from '../event-handler.interface';

@Injectable()
export class ControlHandler implements EventHandler<PusherMessage<Control>> {
  readonly messageType = PusherMessageType.Control;

  constructor(private store: Store) {}

  handle(message: PusherMessage<Control>): void {
    if (message?.message_object) {
      this.store.dispatch(new UpdateControlAction(message.message_object.control_id));
    }
  }
}
