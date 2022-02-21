import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { EventHandler } from '../event-handler.interface';
import { CustomControlRemovedAction } from 'core/modules/data/store/actions';

@Injectable()
export class ControlDeletedHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.ControlDeleted;

  constructor(private store: Store) {}

  handle(message: PusherMessage): void {
    if (message?.message_object) {
      this.store.dispatch( new CustomControlRemovedAction(message.message_object.control_id));
    }
  }
}
