import { Action, createAction, props } from '@ngrx/store';
import { Customer } from '../../models/domain';

export const CustomerActionType = {
  CustomerLoaded: '[Customer] Customer loaded',
  OnBoardCustomer: '[Customer] Customer update',
  CustomerUpdated: '[Customer] Customer updated',
};

export class CustomerLoadedAction implements Action {
  readonly type = CustomerActionType.CustomerLoaded;

  constructor(public customer: Customer) {}
}

export class OnBoardCustomer implements Action {
  readonly type = CustomerActionType.OnBoardCustomer;

  constructor() {}
}

export class CustomerUpdatedAction implements Action {
  readonly type = CustomerActionType.CustomerUpdated;

  constructor(public customer: Partial<Customer>) {}
}

export const CustomerAdapterActions = {
  customerLoaded: createAction(CustomerActionType.CustomerLoaded, props<{ customer: Customer }>()),
  customerUpdated: createAction(CustomerActionType.CustomerUpdated, props<{ customer: Partial<Customer> }>()),
};
