import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { EventHandler } from '../event-handler.interface';
import { UserRemovedAction } from 'core/modules/auth-core/store';

@Injectable()
export class UserDeletedHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.UserDeleted;
  constructor(private store: Store) {}
  handle(message: PusherMessage): void {
    if (message?.message_object) {
      this.store.dispatch(new UserRemovedAction({ email: message.message_object.user_email }));
    }
  }
}
