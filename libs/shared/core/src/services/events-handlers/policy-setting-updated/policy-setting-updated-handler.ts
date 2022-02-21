import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { EventHandler } from '../event-handler.interface';
import { UpdatePolicyAction } from 'core/modules/data/store';

@Injectable()
export class PolicySettingUpdatedHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.PolicySettingUpdated;

  constructor(private store: Store) {}

  handle(message: PusherMessage): void {
    if (message?.message_object) {
      this.store.dispatch(new UpdatePolicyAction(message.message_object.policy_id));
    }
  }
}
