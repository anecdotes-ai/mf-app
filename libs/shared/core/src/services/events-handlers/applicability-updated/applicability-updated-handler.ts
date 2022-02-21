import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { Applicability, ApplicabilityTypeEnum } from 'core/modules/data/models/domain';
import { ControlRequirementApplicabilityChangedAction } from 'core/modules/data/store/actions';
import { EventHandler } from '../event-handler.interface';

@Injectable()
export class ApplicabilityUpdatedHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.ApplicabilityUpdated;
  constructor(private store: Store) {}
  handle(message: PusherMessage<Applicability>): void {
    switch (message?.message_object?.applicability_type) {
      case ApplicabilityTypeEnum.REQUIREMENT: {
        this.store.dispatch(
          new ControlRequirementApplicabilityChangedAction(
            message.message_object.applicability_id,
            message.message_object.is_applicable
          )
        );
        break;
      }
      default: {
        // Do nothing
        break;
      }
    }
  }
}
