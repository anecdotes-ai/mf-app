import { Injector } from '@angular/core';
import Pusher, { Authorizer } from 'pusher-js';
import { PusherMessage, PusherMessageType } from '../models';
import { AuthService } from 'core/modules/auth-core/services';
import { AppConfigService } from '../services/config/app.config.service';
import { MessageBusService } from '../services/message-bus/message-bus.service';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '../services/logger/logger.service';

/**
 * Pusher service is in charge of handling all necessary stuff for our Pusher connection.
 * It is loaded in main app component, connects, handles authentication and then binds himself to the
 * customer channel according to the customer ID.
 *
 * A component/service wishing to subscribe to notifications should inject PusherService and subscribe to
 * notifications$ which will emit a new PusherMessage every time a message is pushed through the channel.
 *
 * PusherMessage is built in that way:
 * {
 * message_type: is of type PusherMessageType and may be one of values specified in that object (Control/Evidence/etc..)
 * message: string (nullable) that can contain a textual representation of the message we want to deliver
 * message_object: object that depends on the message type, for instance, a control updated will look like this:
 *
 * {"message_type": "CONTROL", "message": "", "message_object": {CONTROL_INSTANCE_OBJECT}}
 *
 * 1 exception is the CONNECTIVITY message type which will have message_object of type ConnectivityResult (refer to the
 * model for further details on the structure)
 * }
 */
export async function configurePusher(injector: Injector): Promise<any> {
  const messageBus = injector.get(MessageBusService);
  const configService = injector.get(AppConfigService);
  const authService = injector.get(AuthService);
  const httpClient = injector.get(HttpClient);
  const logger = injector.get(LoggerService);

  if (await authService.isAuthenticatedAsync()) {
    const userInfo = await authService.getUserAsync();
    const authUrl = `${configService.config.api.baseUrl}/${configService.config.pusher.authEndpoint}`;

    let authorizer = (channel, options): Authorizer => {
      return {
        authorize: async (socketId, callback) => {
          try {
            const formData = new FormData();
            formData.append('socket_id', socketId);
            formData.append('channel_name', channel.name);

            const res = await httpClient
              .post<{ auth: string }>(
                authUrl,
                formData,
              )
              .toPromise();
            if (!res?.auth) {
              throw new Error(`Received ${res} from ${authUrl}`);
            }
            return callback(null, res);
          } catch (err) {
            callback(new Error(`Error calling auth endpoint: ${err}`), {
              auth: '',
            });
          }
        },
      };
    };

    const pusherClient = new Pusher(configService.config.pusher.applicationId, {
      cluster: configService.config.pusher.cluster,
      authorizer: authorizer,
      enabledTransports: ['ws', 'wss'],
    });

    if (!userInfo || userInfo === undefined) {
      await this.authService.signOutAsync();
    }

    const channel = pusherClient.subscribe(`private-${userInfo.customer_id}`);
    channel.bind('notification', (data: PusherMessage) => {
      logger.log({
        pusherMessage: data
      });
      if (data) {
        messageBus.sendMessage(data.message_type, data);
      }
    });
  }
}
