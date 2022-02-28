import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const SelectCustomerState = createSelector(dataFeatureSelector, dataFeatureState => dataFeatureState.customerState);

export const CustomerSelectors = {
  SelectCustomerState
};