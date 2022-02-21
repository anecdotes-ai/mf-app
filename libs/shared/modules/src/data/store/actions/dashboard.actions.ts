import { Action, createAction, props } from '@ngrx/store';

export const DashboardActionType = {
  DashboardTimeUpdated: '[Dashboard] Dashboard time updated',
  DashboardStateInitialized: '[Dashboard] Dashboard data loaded',
};

export class DashboardTimeUpdatedAction implements Action {
  readonly type = DashboardActionType.DashboardTimeUpdated;

  constructor(public dashboardTime: Date) {}
}

export class DashboardStateInitializedAction implements Action {
  readonly type = DashboardActionType.DashboardStateInitialized;

  constructor() {}
}

export const DashboardAdapterActions = {
  dashboardTimeUpdated: createAction(DashboardActionType.DashboardTimeUpdated, props<{ dashboardTime: Date }>()),
  dashboardStateInitialized: createAction(DashboardActionType.DashboardStateInitialized),
};
