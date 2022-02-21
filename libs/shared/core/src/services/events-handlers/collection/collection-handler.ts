import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CollectionResult } from 'core/models/collection-result.model';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { UserEvents } from 'core/models/user-events/user-event-data.model';
import { MANUAL } from 'core/modules/data/constants';
import { ServiceTypeEnum } from 'core/modules/data/models/domain';
import { PluginFacadeService } from 'core/modules/data/services';
import { EvidenceCollectionAction, LoadSpecificServiceAction } from 'core/modules/data/store/actions';
import { State } from 'core/modules/data/store/state';
import { map, take } from 'rxjs/operators';
import { EventHandler } from '../event-handler.interface';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';

@Injectable()
export class CollectionHandler implements EventHandler<PusherMessage<CollectionResult>> {
  readonly messageType = PusherMessageType.Collection;

  constructor(
    private store: Store<State>,
    private pluginFacade: PluginFacadeService,
    private pluginConnectionFacade: PluginConnectionFacadeService,
    private pluginsEventService: PluginsEventService
  ) { }

  async handle(message: PusherMessage<CollectionResult>): Promise<void> {
    if (!message.message_object) {
      return;
    }

    let serviceType: string;
    const newRefPusherMessage = {...message.message_object};
    if (newRefPusherMessage.service_id !== MANUAL) {
      await this.trackUserEvent(newRefPusherMessage);
      serviceType = await this.serviceType(newRefPusherMessage.service_id);
    }

    this.store.dispatch(new EvidenceCollectionAction(newRefPusherMessage));

    // in case this is manual service, return no need to display a notification
    if (!serviceType) {
      return;
    }

    this.pluginConnectionFacade.handlePluginCollectionResult(newRefPusherMessage);
  }

  private async trackUserEvent(messageObject: CollectionResult): Promise<void> {
    const collectionEvent = messageObject.status
      ? UserEvents.EVIDENCE_COLLECTION_SUCCEEDED
      : UserEvents.EVIDENCE_COLLECTION_FAILED;

    const servicePulled = await this.store
      .select((s) => s.servicesState)
      .pipe(
        map((state) => {
          return !!state.entities[messageObject.service_id] || state.initialized;
        }),
        take(1)
      )
      .toPromise();

    if (!servicePulled) {
      this.store.dispatch(
        new LoadSpecificServiceAction({
          service_id: messageObject.service_id,
        })
      );
    }

    this.pluginsEventService.trackEvidenceCollectionResult(collectionEvent, messageObject.service_id);
  }

  private async serviceType(serviceId: string): Promise<ServiceTypeEnum> {
    return await this.pluginFacade
      .getServiceById(serviceId)
      .pipe(
        map((s) => s.service_type),
        take(1)
      )
      .toPromise();
  }
}
