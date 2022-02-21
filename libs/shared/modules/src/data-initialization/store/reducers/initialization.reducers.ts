import { Action, createReducer, on } from '@ngrx/store';
import { AppInitializedAction, InitAdapterActions } from '../actions/initialization.actions';

export interface InitState {
  isAppLoaded: boolean;
}

const initialState: InitState = {
  isAppLoaded: false,
};

export function initReducers(state = initialState, action: Action): InitState {
  return adapterReducer(state, action);
}

const adapterReducer = createReducer(
  initialState,
  on(InitAdapterActions.appInitialized, (state: InitState, action: AppInitializedAction) => {
    return { isAppLoaded: true };
  })
);
