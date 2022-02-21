import { Injectable } from '@angular/core';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { AuditLog } from 'core/modules/data/models/domain';
import { FrameworksFacadeService, ControlsFacadeService } from 'core/modules/data/services';
import { EventHandler } from '../event-handler.interface';

@Injectable()
export class FrameworkAuditEndedHandler implements EventHandler<PusherMessage<AuditLog>> {
  readonly messageType = PusherMessageType.FrameworkAuditEnded;

  constructor(private frameworkFacade: FrameworksFacadeService, private controlsFacade: ControlsFacadeService) {}

  handle(message: PusherMessage<AuditLog>): void {
    if (message?.message_object) {
      this.frameworkFacade.frameworkAuditEnded(message.message_object);
      this.controlsFacade.reloadControls();
    }
  }
}
