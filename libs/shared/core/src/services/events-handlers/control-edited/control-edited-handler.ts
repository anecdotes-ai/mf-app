import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ControlEdited } from 'core';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { BatchControlsUpdatedAction, UpdateControlAction } from 'core/modules/data/store/actions';
import { EventHandler } from '../event-handler.interface';

@Injectable()
export class ControlEditedHandler implements EventHandler<PusherMessage<ControlEdited>> {
  readonly messageType = PusherMessageType.ControlEdited;

  constructor(private store: Store) {}

  handle(message: PusherMessage<ControlEdited>): void {
    if (message?.message_object) {
      this.store.dispatch(new BatchControlsUpdatedAction([message.message_object.updated_control]));
      if (message.message_object.updated_control?.is_snapshot === false) {
        this.store.dispatch(new UpdateControlAction(message.message_object.control_id));
      }
    }
  }
}
