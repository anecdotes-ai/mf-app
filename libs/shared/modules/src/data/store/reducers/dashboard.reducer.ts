import { Action, createReducer, on } from '@ngrx/store';
import { DashboardAdapterActions, DashboardTimeUpdatedAction } from '../actions';

export interface DashboardState {
  initialized: boolean;
  lastUpdateDate: string;
}

export const initialState: DashboardState = {
  initialized: false,
  lastUpdateDate: new Date().toJSON(),
};

const adapterReducer = createReducer(
  initialState,
  on(DashboardAdapterActions.dashboardTimeUpdated, (state: DashboardState, action: DashboardTimeUpdatedAction) => ({
    ...state,
    // ERROR TypeError: action.dashboardTime.toJSON is not a function
    lastUpdateDate: action.dashboardTime instanceof Date ? action.dashboardTime.toJSON() : action.dashboardTime,
  })),
  on(DashboardAdapterActions.dashboardStateInitialized, (state: DashboardState) => ({ ...state, initialized: true }))
);

export function dashboardReducer(state = initialState, action: Action): DashboardState {
  return adapterReducer(state, action);
}
