import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { EventHandler } from '../event-handler.interface';
import { PolicyUpdatedAction } from 'core/modules/data/store';

@Injectable()
export class PolicyEditedHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.PolicyEdited;

  constructor(private store: Store) {}

  handle(message: PusherMessage): void {
    if (message.message_object.policy_id && message.message_object.updated_policy) {
      this.store.dispatch(
        new PolicyUpdatedAction(message.message_object.updated_policy.policy_id, message.message_object.updated_policy));
    }
  }
}
