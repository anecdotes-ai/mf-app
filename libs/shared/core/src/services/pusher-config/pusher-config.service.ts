import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, NgZone } from '@angular/core';
import { AuthService } from 'core/modules/auth-core/services';
import Pusher, { Authorizer, Channel } from 'pusher-js';
import { AuthorizerOptions } from 'pusher-js/types/src/core/auth/options';
import { PusherMessage } from '../../models';
import { UserClaims } from 'core/modules/auth-core/models';
import { AppConfigService } from '../config/app.config.service';
import { EventHandler, eventHandlerToken } from '../events-handlers';
import { LoggerService } from '../logger/logger.service';
import { MessageBusService } from '../message-bus/message-bus.service';
import { Subject } from 'rxjs';

enum PusherStates {
  initialized = 'initialized',
  connecting = 'connecting',
  connected = 'connected',
  unavailable = 'unavailable',
  failed = 'failed',
  disconnected = 'disconnected',
}

@Injectable({
  providedIn: 'root',
})
export class PusherConfigService {
  private pusherDisconnected = new Subject<any>();
  private pusherClient: Pusher;
  private wereListenersInit = false;
  private channelName: string;
  private currentUserInfo: UserClaims;

  constructor(
    private messageBus: MessageBusService,
    private configService: AppConfigService,
    private authService: AuthService,
    private httpClient: HttpClient,
    private logger: LoggerService,
    private zone: NgZone,
    private injector: Injector
  ) {}

  async initPusher(): Promise<void> {
    /**
     * Initializes pusher client only in case there is no active pusher on the platform already.
     */
    if (this.pusherClient || !(await this.authService.isAuthenticatedAsync())) {
      return;
    }

    this.currentUserInfo = await this.authService.getUserAsync();
    if (!this.currentUserInfo) {
      await this.authService.signOutAsync();
      return;
    }

    this.pusherClient = new Pusher(this.configService.config.pusher.applicationId, {
      cluster: this.configService.config.pusher.cluster,
      authorizer: this.generateAuthorizer(),
      enabledTransports: ['ws', 'wss'],
    });
  
    this.subscribeToPrivateChannel();
  }

  initListeners(): void {
    /**
     * initiates the listeners to the event handlers which are supposed to handle different types of pusher events.
     */
    if (this.wereListenersInit) {
      return;
    }

    const listeners = this.injector.get<EventHandler<any>[]>(eventHandlerToken, []);
    listeners.forEach((handler) =>
      this.messageBus.getObservable(handler.messageType).subscribe((message) => {
        this.zone.run(() => handler.handle(message));
      })
    );

    this.wereListenersInit = true;
  }

  private generateAuthorizer(): (channel: Channel, _: AuthorizerOptions) => Authorizer {
    /**
     * created an token authorizer by using angulars custom http client (which has the updated token of the platform stored in it)
     */
    const config = this.configService.config;
    const authUrl = `${config.api.baseUrl}/${config.pusher.authEndpoint}`;

    return (channel: Channel, _: AuthorizerOptions): Authorizer => {
      return {
        authorize: async (socketId, callback) => {
          try {
            const formData = new FormData();
            formData.append('socket_id', socketId);
            formData.append('channel_name', channel.name);

            const res = await this.httpClient.post<{ auth: string }>(authUrl, formData).toPromise();
            return callback(null, res);
          } catch (err) {
            callback(new Error(`Error calling auth endpoint: ${err}`), {
              auth: '',
            });
          }
        },
      };
    };
  }

  private subscribeToPrivateChannel(): void {
    /**
     * subscribes to a private channel only in case there is no existing subscription in the platform already.
     */
    if (!this.pusherClient) {
      return;
    }

    this.channelName = `private-${this.currentUserInfo.customer_id}`;
    const channel = this.pusherClient.subscribe(this.channelName);
    channel.bind('notification', (data: PusherMessage) => {
      this.logger.log({
        pusherMessage: data,
      });
      if (data) {
        this.messageBus.sendMessage(data.message_type, data);
      }
    });
  }
}
