import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose } from '@ngrx/store';
export const featureKey = 'risk-data';

export interface RiskDataState {
  riskDataState: t.RiskState;
}

export const reducers: ActionReducerMap<RiskDataState> = {
  riskDataState: t.risksReducer,
};

export function store(state: any, action: any): RiskDataState {
  const actionReducer = compose(combineReducers)(reducers);
  return actionReducer(state, action);
}
