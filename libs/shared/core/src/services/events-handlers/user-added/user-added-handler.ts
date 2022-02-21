import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RoleService } from 'core/modules/auth-core/services';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { UserCreatedAction } from 'core/modules/auth-core/store';
import { EventHandler } from '../event-handler.interface';

@Injectable()
export class UserAddedHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.UserAdded;
  constructor(private store: Store, private roleService: RoleService) {}
  handle(message: PusherMessage): void {
    if (message?.message_object) {
      this.store.dispatch(
        new UserCreatedAction({
          audit_id: message.message_object.audit_id,
          email: message.message_object.email,
          first_name: message.message_object.first_name,
          last_name: message.message_object.last_name,
          role: this.roleService.mapRole(message.message_object.role),
          status: message.message_object.status,
        })
      );
    }
  }
}
