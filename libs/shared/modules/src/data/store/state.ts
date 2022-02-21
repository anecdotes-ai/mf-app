import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose } from '@ngrx/store';

export interface State {
  auditLogsState?: t.AuditLogsState;
  controlsState?: t.ControlsState;
  evidencesState?: t.EvidenceState;
  pluginsNotificationsState?: t.PluginNotificationsState;
  servicesState?: t.ServicesState;
  frameworksState?: t.FrameworksState;
  dashboardState?: t.DashboardState;
  requirementState?: t.RequirementsState;
  customerState?: t.CustomerState;
  calculationState?: t.CalculationState;
  snapshotState?: t.SnapshotState;
  policyState?: t.PolicyState;
  agentState?: t.AgentsState;
}

export const reducers: ActionReducerMap<State> = {
  auditLogsState: t.auditLogsReducer,
  controlsState: t.controlsReducer,
  evidencesState: t.evidencesReducer,
  pluginsNotificationsState: t.pluginNotificationsReducer,
  servicesState: t.servicesReducer,
  frameworksState: t.frameworksReducer,
  dashboardState: t.dashboardReducer,
  requirementState: t.requirementsReducer,
  customerState: t.customerReducer,
  calculationState: t.calculationReducer,
  snapshotState: t.snapshotReducer,
  policyState: t.policiesReducer,
  agentState: t.agentsReducer
};

// tslint:disable-next-line:typedef
export function store(state: any, action: any): State {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
