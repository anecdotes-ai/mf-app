import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { EventHandler } from '../event-handler.interface';
import { RisksActions } from 'core/modules/risk/store';

@Injectable()
export class RiskDeletedHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.RiskDeleted;

  constructor(private store: Store) {}

  handle(message: PusherMessage): void {
    if (message?.message_object?.updated) {
      this.store.dispatch(RisksActions.RiskDeleted({ risk_id: message.message_object.updated.risk_id }));
    }
  }
}
