import { createSelector } from '@ngrx/store';
import { Service } from '../../models/domain';
import { dataFeatureSelector } from './feature.selector';

// ** SELECTOR FUNCTIONS ***
const SelectServiceState = createSelector(dataFeatureSelector, dataFeatureState => dataFeatureState.servicesState);

const SelectServicesInitState = createSelector(SelectServiceState, (servicesState): boolean => servicesState.initialized);
const SelectServicesDictionary = createSelector(SelectServiceState, (servicesState) => servicesState.entities);
const SelectServicesEntities = createSelector(SelectServicesDictionary, (dictionary) => Object.values(dictionary).map(storeEntity => storeEntity.service));
// ** SELECTORS **

const SelectServices = createSelector(
  SelectServicesInitState,
  SelectServicesEntities,
  (isInitialized, services) => {
    if (!isInitialized) {
      return null;
    }
    return services;
  }
);

export const SelectServiceById = createSelector(
  SelectServicesEntities,
  (services: Service[], props: { serviceId: string }) => {
    return services.find((s) => s.service_id === props.serviceId);
  }
);

export const ServiceSelectors = {
  SelectServiceState,
  SelectServices,
  SelectServiceById,
  SelectServicesEntities
};

