import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const selectDashboardState = createSelector(dataFeatureSelector, dataFeatureState => dataFeatureState.dashboardState);
export const selectDashboardInitState = createSelector(selectDashboardState, (dashboardState) => dashboardState.initialized);

export const selectDashboard = createSelector(selectDashboardInitState, (isInit) => isInit);
