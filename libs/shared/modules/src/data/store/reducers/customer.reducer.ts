import { Action, createReducer, on } from '@ngrx/store';
import { Customer } from '../../models/domain';
import { CustomerAdapterActions, CustomerLoadedAction, CustomerUpdatedAction } from '../actions';

export interface CustomerState {
  initialized: boolean;
  customer: Customer;
}

const initialState: CustomerState = {
  initialized: false,
  customer: undefined,
};

const adapterReducer = createReducer(
  initialState,
  on(CustomerAdapterActions.customerLoaded, (state: CustomerState, action: CustomerLoadedAction) => ({
    ...state,
    initialized: true,
    customer: action.customer,
  })),
  on(CustomerAdapterActions.customerUpdated, (state: CustomerState, action: CustomerUpdatedAction) => ({
    ...state,
    customer: { ...state.customer, ...action.customer },
  }))
);

export function customerReducer(state = initialState, action: Action): CustomerState {
  return adapterReducer(state, action);
}
