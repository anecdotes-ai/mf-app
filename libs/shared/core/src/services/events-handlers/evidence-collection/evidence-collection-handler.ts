import { EvidenceCollectionResult } from 'core/models/evidence-collection-result';
import { PusherMessage } from 'core/models/pusher-message.model';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { EventHandler } from '../event-handler.interface';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { EvidenceCollectionMessages } from 'core/services/message-bus/constants/evidence-collection-messages.constants';
import { Injectable } from '@angular/core';

@Injectable()
export class EvidenceCollectionHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.EvidenceCollection;

  constructor(
    private messageBus: MessageBusService,
  ) { }

  handle(message: PusherMessage<EvidenceCollectionResult>): void {
    if (message?.message_object) {
      this.messageBus.sendMessage(EvidenceCollectionMessages.EVIDENCE_COLLECTED, message.message_object, message.message_object.evidence_id);
    }
  }
}
