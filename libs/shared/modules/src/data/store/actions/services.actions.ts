import { Dictionary } from '@ngrx/entity';
import { Action, createAction, props } from '@ngrx/store';
import { Operation } from 'fast-json-patch';
import { Service, ServiceLog, ServiceStatusEnum } from '../../models/domain';

export const ServiceActionType = {
  InitServicesState: '[Services] Init state',

  LoadSpecificService: '[Services] Load specific service',

  LoadSpecificServiceInstance: '[Service] Load specific service instance',

  SpecificServiceInstanceLoaded: '[Service] Specific service instance loaded',

  ServiceIsFull: '[Services] service is full',

  DisableService: '[Services] Disable service',

  ServicesLoaded: '[Services] Services loaded',

  InstallService: '[Services] Install service',

  ReconnectService: '[Services] Reconnect service',

  ServiceUpdated: '[Service] Service updated',

  CreateTask: '[Service] Create task',

  TaskCreated: '[Service] Task created',

  LoadServiceInstanceLogs: '[Service logs] Service instance logs loading',

  ServiceLogsAdded: '[Service log] Service log is added',

  ServiceAddToFavourites: '[Service] Service add to favourite',

  RemoveFromFavourites: '[Service] Service remove from favourites',

  ServiceConnectivityHandling: '[Service Pusher Message] Handling for connectivity message',

  ServiceInstanceUpdated: '[Service instance] Service Instance Updated'
};

export class InitServicesStateAction implements Action {
  readonly type = ServiceActionType.InitServicesState;

  constructor() { }
}

export class LoadSpecificServiceAction implements Action {
  readonly type = ServiceActionType.LoadSpecificService;

  constructor(public payload: { service_id: string }) { }
}

export class LoadSpecificServiceInstanceAction implements Action {
  readonly type = ServiceActionType.LoadSpecificServiceInstance;

  constructor(public service_id: string, public service_instance_id: string) { }
}

export class DisableServiceAction implements Action {
  readonly type = ServiceActionType.DisableService;

  constructor(public payload: Service, public selectedInstanceIdToRemove: string) { }
}

export class ServicesLoadedAction implements Action {
  readonly type = ServiceActionType.ServicesLoaded;

  constructor(public payload: Service[]) { }
}

export interface ServiceIdPropertyActionPayload {
  service_id: string
}

export class InstallServiceAction implements Action, ServiceIdPropertyActionPayload {
  readonly type = ServiceActionType.InstallService;
  service_id: string;

  constructor(public payload: { service_id: string }) { 
    this.service_id = this.payload.service_id;
  }
}

export class ReconnectServiceAction implements Action, ServiceIdPropertyActionPayload {
  readonly type = ServiceActionType.ReconnectService;
  service_id: string;

  constructor(
    public payload: { service_id: string; service_intance_id: string; service_secrets_operations: Operation[]; raw_service_secrets: any }
  ) { this.service_id = this.payload.service_id; }
}

export class ServiceUpdated implements Action {
  readonly type = ServiceActionType.ServiceUpdated;

  constructor(
    public service: Service
  ) { }
}

export class ServiceCreateTaskAction implements Action, ServiceIdPropertyActionPayload {
  readonly type = ServiceActionType.CreateTask;

  constructor(public service_id: string) { }
}

export class ServiceTaskCreatedAction implements Action {
  readonly type = ServiceActionType.TaskCreated;

  constructor(public service_id: string) { }
}


export class AddToFavouritesAction implements Action {
  readonly type = ServiceActionType.ServiceAddToFavourites;

  constructor(public service_id: string) { }
}

export class RemoveFromFavouritesAction implements Action {
  readonly type = ServiceActionType.RemoveFromFavourites;

  constructor(public service_id: string) { }
}

export const ServiceAdapterActions = {
  servicesLoaded: createAction(ServiceActionType.ServicesLoaded, props<{ payload: Service[] }>()),
  serviceIsFull: createAction(ServiceActionType.ServiceIsFull, props<{ service_id: string, isFull: boolean }>()),
  specificServiceInstanceLoaded: createAction(ServiceActionType.SpecificServiceInstanceLoaded, props<{ service: Service }>()),
  serviceUpdated: createAction(
    ServiceActionType.ServiceUpdated,
    props<{ service: Service }>()
  ),
  serviceInstanceUpdate:createAction(
    ServiceActionType.ServiceInstanceUpdated,
    props<{ service_id: string, service_instance_id: string, serviceInstance: Partial<Service> }>()
  ),
  loadServiceInstanceLogs: createAction(
    ServiceActionType.LoadServiceInstanceLogs,
    props<{
      service_id: string; service_instance_id?: string;
    }>()
  ),
  serviceLogsAdded: createAction(
    ServiceActionType.ServiceLogsAdded,
    props<{
      service_id: string;
      service_instance_id?: string
      serviceLogs: Dictionary<ServiceLog[]>;
    }>()
  ),
  serviceConnectivityHandling: createAction(
    ServiceActionType.ServiceConnectivityHandling,
    props<{
      service_id: string;
      service_instance_id?: string;
      message_status: boolean;
      service_instance_status: ServiceStatusEnum
    }>()
  ),
};
