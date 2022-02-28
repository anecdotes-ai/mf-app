import { Injectable } from '@angular/core';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { PluginService } from '../../plugin/plugin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { PusherMessage, PusherMessageType, ServiceMetaUpdated } from 'core/models';

@Injectable()
export class PluginsMetaFacadeService {
  private _serviceMetaCache$: { [serviceInstanceId: string]: BehaviorSubject<any> } = {};

  constructor(private pluginsService: PluginService, private messageBusService: MessageBusService) {
    this.messageBusService
      .getObservable<PusherMessage<ServiceMetaUpdated>>(PusherMessageType.ServiceMetaUpdated)
      .pipe(
        map((pusherMsg) => ({ serviceId: pusherMsg.message_object?.service_id, serviceInstanceId: pusherMsg.message_object.service_instance_id })),
        filter((serviceObj) => Object.keys(this._serviceMetaCache$).includes(serviceObj.serviceInstanceId)),
        switchMap((serviceObj) => this.retrieveServiceMeta(serviceObj.serviceId, serviceObj.serviceInstanceId))
      )
      .subscribe();
  }

  getServiceMetadata(serviceId: string, serviceInstanceId: string): Observable<any> {
    return this.wasMetaRetrieved(serviceInstanceId)
      ? this._serviceMetaCache$[serviceInstanceId].asObservable()
      : this.retrieveServiceMeta(serviceId, serviceInstanceId);
  }

  private retrieveServiceMeta(serviceId: string, serviceInstanceId: string): Observable<any> {
    return this.pluginsService.getServiceMetadata(serviceId, serviceInstanceId).pipe(
      switchMap((meta) => {
        this.wasMetaRetrieved(serviceInstanceId)
          ? this._serviceMetaCache$[serviceInstanceId].next(meta) // force update
          : (this._serviceMetaCache$[serviceInstanceId] = new BehaviorSubject(meta)); // new service meta
        return this._serviceMetaCache$[serviceInstanceId].asObservable();
      })
    );
  }

  private wasMetaRetrieved(serviceInstanceId: string): boolean {
    return serviceInstanceId in this._serviceMetaCache$;
  }
}
