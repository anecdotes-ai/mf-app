import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose, createFeatureSelector, createSelector } from '@ngrx/store';

export const featureKey = 'pluginsConnection';

export interface PluginsConnectionState {
  connection: t.PluginsConnectionFeatureState;
}

export const reducers: ActionReducerMap<PluginsConnectionState> = {
  connection: t.pluginsConnectionReducer,
};

export const pluginConnectionStateFeatureSelector = createFeatureSelector<PluginsConnectionState>(featureKey);

export const pluginConnectionStateSelector = createSelector(
  pluginConnectionStateFeatureSelector,
  (state: PluginsConnectionState) => state.connection
);

// tslint:disable-next-line:typedef
export function store(state: any, action: any): PluginsConnectionState {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
