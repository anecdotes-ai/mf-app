import { State } from '../state';
import { createSelector } from '@ngrx/store';
import { CustomerState } from '../reducers';

export const selectCustomerState = (state: State): CustomerState => state.customerState;

export const selectCustomer = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.customer
);

export const selectCustomerIsOnboarded = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.customer?.is_onboarded
);

export const selectCustomerAccountFeatures = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.customer?.account_features
);
