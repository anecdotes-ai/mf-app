import { PluginConnectionAdapterActions } from './../../../plugins-connection/store/actions/plugin-connection.actions';
import { createEntityAdapter, Dictionary, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Service, ServiceLog, ServiceStatusEnum } from '../../models/domain';
import { ServiceAdapterActions, ServicesLoadedAction } from '../actions';
export interface ServiceStoreEntity {
  service: Service;
  isFullService?: boolean;
  fullServiceInstances?: Dictionary<Service>;
  serviceLogs?: Dictionary<ServiceLog[]>;
}

export interface ServicesState extends EntityState<ServiceStoreEntity> {
  initialized: boolean;
}

function selectServiceId(c: ServiceStoreEntity): string {
  return c.service.service_id;
}

export const serviceAdapter: EntityAdapter<ServiceStoreEntity> = createEntityAdapter<ServiceStoreEntity>({
  selectId: selectServiceId,
});

const initialState: ServicesState = serviceAdapter.getInitialState({ initialized: false });

const adapterReducer = createReducer(
  initialState,
  on(ServiceAdapterActions.servicesLoaded, (state: ServicesState, action: ServicesLoadedAction) => {
    return serviceAdapter.upsertMany(action.payload.length ? action.payload.map((service) => ({ service })) : [], {
      ...state,
      initialized: true,
    });
  }),
  on(ServiceAdapterActions.serviceUpdated, (state: ServicesState, action) => {
    if (state.entities[action.service.service_id]) {
      const serviceStateEntity = state.entities[action.service.service_id];
      const updatedServiceStateEntity: ServiceStoreEntity = {
        ...serviceStateEntity,
        service: { ...serviceStateEntity.service, ...action.service },
      };
      return serviceAdapter.updateOne({ id: action.service.service_id, changes: updatedServiceStateEntity }, state);
    } else {
      return serviceAdapter.upsertOne({ service: action.service }, state);
    }
  }),
  on(ServiceAdapterActions.serviceInstanceUpdate, (state: ServicesState, action) => {
    if (state.entities[action.service_id] && state.entities[action.service_id].fullServiceInstances[action.service_instance_id]) {
      const serviceStateEntity = state.entities[action.service_id];
      const serviceInstance = state.entities[action.service_id].fullServiceInstances[action.service_instance_id];
      const updatedServiceStateEntity: ServiceStoreEntity = {
        ...serviceStateEntity,
        fullServiceInstances: { ...serviceStateEntity.fullServiceInstances, [action.service_instance_id]: {...serviceInstance, ...action.serviceInstance} },
      };
      return serviceAdapter.updateOne({ id: action.service_id, changes: updatedServiceStateEntity }, state);
    } else {
      return serviceAdapter.upsertOne({ service: action.serviceInstance }, state);
    }
  }),

  on(ServiceAdapterActions.serviceIsFull, (state: ServicesState, action) => {
    if (state.entities[action.service_id]) {
      const serviceStateEntity = state.entities[action.service_id];
      const updatedServiceStateEntity: ServiceStoreEntity = {
        ...serviceStateEntity,
        isFullService: action.isFull,
      };
      return serviceAdapter.updateOne({ id: action.service_id, changes: updatedServiceStateEntity }, state);
    } else {
      throw new Error('The service not loaded to set isFull');
    }
  }),
  on(ServiceAdapterActions.specificServiceInstanceLoaded, (state: ServicesState, action) => {
    if (state.entities[action.service.service_id]) {
      const serviceStateEntity = state.entities[action.service.service_id];
      const newlyFetchedInstance = { [action.service.service_instances_list[0].service_instance_id]: action.service };
      const updatedServiceStateEntity: ServiceStoreEntity = {
        ...serviceStateEntity,
        fullServiceInstances: serviceStateEntity.fullServiceInstances
          ? { ...serviceStateEntity.fullServiceInstances, ...newlyFetchedInstance }
          : newlyFetchedInstance,
      };
      return serviceAdapter.updateOne({ id: action.service.service_id, changes: updatedServiceStateEntity }, state);
    }
    return state; 
  }),
  on(ServiceAdapterActions.serviceLogsAdded, (state: ServicesState, action) => {
    const serviceStoreEntity = state.entities[action.service_id];

    if (serviceStoreEntity) {
      if (!serviceStoreEntity.serviceLogs) {
        serviceStoreEntity.serviceLogs = action.serviceLogs;
      } else {
        Object.keys(action.serviceLogs).forEach((serviceInstanceId) => {
          const resolvedCurrentLogs = serviceStoreEntity.serviceLogs[serviceInstanceId] ?? [];
          serviceStoreEntity.serviceLogs[serviceInstanceId] = [
            ...resolvedCurrentLogs,
            ...action.serviceLogs[serviceInstanceId],
          ];
        });
      }
      return serviceAdapter.updateOne({ id: action.service_id, changes: serviceStoreEntity }, state);
    }
    return state;
  }),
  on(PluginConnectionAdapterActions.removeServiceInstance, (state: ServicesState, action) => {
    const serviceStoreEntity = state.entities[action.service_id];
    if (serviceStoreEntity && serviceStoreEntity.service.service_instances_list.find((s) => s.service_instance_id === action.instance_id)) {
      const index = serviceStoreEntity.service.service_instances_list.findIndex((s) => s.service_instance_id === action.instance_id);
      serviceStoreEntity.service.service_instances_list[index] = { ...serviceStoreEntity.service.service_instances_list[index], service_status: ServiceStatusEnum.REMOVED };
      // Assign a status to instance;
      if (serviceStoreEntity.fullServiceInstances && serviceStoreEntity.fullServiceInstances[action.instance_id]) {
        serviceStoreEntity.fullServiceInstances[action.instance_id].service_status = ServiceStatusEnum.REMOVED;
        const instanceIndex = serviceStoreEntity.fullServiceInstances[action.instance_id].service_instances_list.findIndex((s) => s.service_instance_id === action.instance_id);
        serviceStoreEntity.fullServiceInstances[action.instance_id].service_instances_list[instanceIndex].service_status = ServiceStatusEnum.REMOVED;
      }

      if (!serviceStoreEntity.service.service_instances_list.some((s) => s.service_status !== ServiceStatusEnum.REMOVED)) {
        serviceStoreEntity.service.service_status = ServiceStatusEnum.REMOVED;
      }
      return serviceAdapter.updateOne({ id: action.service_id, changes: serviceStoreEntity }, state);
    }
    return state;
  })
);

export function servicesReducer(state = initialState, action: Action): ServicesState {
  return adapterReducer(state, action);
}
