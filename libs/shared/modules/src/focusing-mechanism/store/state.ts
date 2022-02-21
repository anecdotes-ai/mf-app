import { ActionReducerMap, combineReducers, compose, createFeatureSelector, createSelector } from '@ngrx/store';
import * as t from './reducers';

export { FocusingState } from './reducers';
export const featureKey = 'focusing-mechanism';
export const featureSelector = createSelector(createFeatureSelector<FocusingFeatureState>(featureKey), featureState => featureState.focusingState);

export interface FocusingFeatureState {
  focusingState: t.FocusingState;
}

export const reducers: ActionReducerMap<FocusingFeatureState> = {
  focusingState: t.focusingReduser,
};

export function store(state: any, action: any): FocusingFeatureState {
  const actionReducer = compose(combineReducers)(reducers);
  return actionReducer(state, action);
}
