import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { Framework } from 'core/modules/data/models/domain';
import { FrameworkUpdatedAction } from 'core/modules/data/store/actions';
import { EventHandler } from '../event-handler.interface';

@Injectable()
export class FrameworkUpdatedHandler implements EventHandler<PusherMessage<Framework>> {
  readonly messageType = PusherMessageType.FrameworkUpdated;

  constructor(private store: Store) {}

  handle(message: PusherMessage<Framework>): void {
    if (message?.message_object) {
      this.store.dispatch(new FrameworkUpdatedAction(message.message_object));
    }
  }
}
