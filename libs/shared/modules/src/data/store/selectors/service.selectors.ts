import { ServiceStoreEntity } from '../../store/reducers';
import { createSelector } from '@ngrx/store';
import { State } from '../state';
import { Service } from '../../models/domain';

// ** SELECTOR FUNCTIONS ***

export const selectServicesInitState = (state: State): boolean => state.servicesState.initialized;
export const selectServicesDictionary = createSelector((state: State) => state, (state) => state.servicesState.entities);
export const selectServicesEntities = createSelector(selectServicesDictionary, (dictionary) => Object.values(dictionary).map(storeEntity => storeEntity.service));

export const selectStateEntities = (state: State): ServiceStoreEntity[] =>
  Object.values(state.servicesState.entities).map((storeEntity) => storeEntity);

// ** SELECTORS **

export const selectServices = createSelector(
  selectServicesInitState,
  selectServicesEntities,
  (isInitialized, services) => {
    if (!isInitialized) {
      return null;
    }
    return services;
  }
);

export const selectServiceById = createSelector(
  selectServicesEntities,
  (services: Service[], props: { serviceId: string }) => {
    return services.find((s) => s.service_id === props.serviceId);
  }
);

export const selectFullServiceInstanceById = createSelector(
  selectStateEntities,
  (serviceEntity: ServiceStoreEntity[], props: { serviceId: string, instanceId: string }) => {
    return serviceEntity.find((e) => e.service?.service_id === props.serviceId)?.fullServiceInstances[props.instanceId];
  }
);
