import { createSelector } from '@ngrx/store';
import { State } from '../state';

export const selectDashboardInitState = (state: State): boolean => state.dashboardState.initialized;

export const selectDashboard = createSelector(selectDashboardInitState, (isInit) => isInit);
