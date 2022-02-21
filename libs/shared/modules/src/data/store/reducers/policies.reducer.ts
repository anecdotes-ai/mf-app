import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import {Policy} from '../../models/domain';
import {
  BatchPolicyUpdatedAction,
  CustomPolicyAddedAction,
  CustomPolicyRemovedAction,
  PoliciesAdapterActions,
  PoliciesLoadedAction,
  PolicySettingsUpdatedAction,
  PolicyUpdatedAction
} from '../actions/policies.actions';

export interface PolicyState {
  areAllLoaded: boolean;
  policies: EntityState<Policy>;
}

function selectPolicyId(c: Policy): string {
  return c.policy_id;
}

const policiesAdapter: EntityAdapter<Policy> = createEntityAdapter<Policy>({
  selectId: selectPolicyId,
});

const initialState: PolicyState = {
  policies: policiesAdapter.getInitialState({}),
  areAllLoaded: false,
};


export function policiesReducer(state = initialState, action: Action): PolicyState {
  return adapterReducer(state, action);
}

const adapterReducer = createReducer(
  initialState,
  on(PoliciesAdapterActions.policiesLoaded, (state: PolicyState, action: PoliciesLoadedAction) => {
    return {
      ...state,
      areAllLoaded: true,
      policies: policiesAdapter.upsertMany(action.policies, state.policies)
    };
  }),
  on(PoliciesAdapterActions.customPolicyAdded, (state: PolicyState, action: CustomPolicyAddedAction) => {
     return {
      ...state,
      policies: policiesAdapter.addOne(action.policy, state.policies)
    };
  }),
  on(PoliciesAdapterActions.customPolicyRemoved, (state: PolicyState, action: CustomPolicyRemovedAction) => {
     return {
      ...state,
      policies: policiesAdapter.removeOne(action.policyId, state.policies)
    };
  }),
  on(PoliciesAdapterActions.customPolicyUpdated, (state: PolicyState, action: PolicyUpdatedAction) => {
     return {
      ...state,
      policies: policiesAdapter.updateOne({id: action.policyId, changes: action.policy}, state.policies)
    };
  }),
  on(PoliciesAdapterActions.batchPoliciesUpdated, (state: PolicyState, action: BatchPolicyUpdatedAction) => {
    return {
      ...state,
      policies: policiesAdapter.updateMany(
        action.batch.map((p) => ({ id: selectPolicyId(p), changes: p })),
        state.policies
      ),
    };
  }),
  on(PoliciesAdapterActions.policySettingsUpdated, (state: PolicyState, action: PolicySettingsUpdatedAction) => {
     return {
      ...state,
      policies: policiesAdapter.updateOne({id: action.policyId, changes: {policy_settings: action.settingData}}, state.policies)
    };
  }),
);
