import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { EventHandler } from '../event-handler.interface';
import { CustomPolicyAddedAction } from 'core/modules/data/store';

@Injectable()
export class PolicyAddedHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.PolicyCreated;

  constructor(private store: Store) {}

  handle(message: PusherMessage): void {
    if (message.message_object?.updated_policy) {
      this.store.dispatch(new CustomPolicyAddedAction(message.message_object.updated_policy));
    }
  }
}
