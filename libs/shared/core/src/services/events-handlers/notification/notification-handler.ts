import { Injectable } from '@angular/core';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { AuthService } from 'core/modules/auth-core/services';
import { PushNotification } from 'core/modules/notifications/models';
import { NotificationsFacadeService } from 'core/modules/notifications/services';
import { EventHandler } from '../event-handler.interface';

@Injectable()
export class NotificationHandler implements EventHandler<PusherMessage<PushNotification>> {
  readonly messageType = PusherMessageType.NotificationCreated;

  constructor(private notificationsFacade: NotificationsFacadeService, private userService: AuthService) {}

  async handle(message: PusherMessage<PushNotification>): Promise<void> {
    if (!(message?.message_object?.users_list)) {
      return;
    }
    const user = await this.userService.getUserAsync();
    if (message.message_object.users_list.includes(user.user_id)) {
      this.notificationsFacade.loadLatest(decodeURI(message.message_object.notifications_time));
    }
  }
}
