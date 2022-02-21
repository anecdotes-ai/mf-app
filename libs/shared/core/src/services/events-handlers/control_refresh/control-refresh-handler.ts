import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { ReloadControlsAction } from 'core/modules/data/store/actions';
import { EventHandler } from '../event-handler.interface';

@Injectable()
export class ControlRefreshHandler implements EventHandler<PusherMessage<any>> {
  readonly messageType = PusherMessageType.ControlRefresh;

  constructor(private store: Store) {}

  async handle(message: PusherMessage<any>): Promise<void> {
   this.store.dispatch(new ReloadControlsAction());
  }
}
