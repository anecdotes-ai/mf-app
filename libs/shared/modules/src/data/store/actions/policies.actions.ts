import { Action, createAction, props } from '@ngrx/store';
import { CustomPolicy, Policy, PolicySettings, PolicyShare, ApproveOnBehalf } from '../../models/domain';

export const PolicyActionType = {
  InitPoliciesState: '[Policies] Init state',

  PoliciesLoaded: '[Policies] Policies loaded',

  AddCustomPolicy: '[Add Policy] Add custom policy',
  CustomPolicyAdded: '[Add Policy] Custom policy added',

  EditCustomPolicy: '[Edit Policy] Edit custom policy',
  PolicyUpdated: '[Policy] Policy updated',

  RemoveCustomPolicy: '[Policies] Remove custom policy',
  CustomPolicyRemoved: '[Policies] Custom policy removed',

  UpdatePolicy: '[Policy] Update policy',
  BatchPoliciesUpdated: '[Policies] Policies Updated',

  EditPolicySettings: '[Edit Policy Settings] Edit policy settings',
  PolicySettingsUpdated: '[Policy Settings] Policy settings was updated',

  EditApproveOnBehalf: '[Approve on behalf] Approve on behalf',
  ApproveOnBehalfUpdated: '[Policy Settings] Approved on behalf saved',

  SharePolicy: '[Policy Share] Share Policy',
  PolicyShared: '[Policy Settings] Policy Shared'
};

export class PoliciesLoadedAction implements Action {
  readonly type = PolicyActionType.PoliciesLoaded;

  constructor(public policies: Policy[]) {}
}

// ** INIT **
export class InitPoliciesStateAction implements Action {
  readonly type = PolicyActionType.InitPoliciesState;
}

// ** CUSTOMIZE Policy **
export class AddCustomPolicyAction implements Action {
  readonly type = PolicyActionType.AddCustomPolicy;

  constructor(public modalData: CustomPolicy) {}
}

export class CustomPolicyAddedAction implements Action {
  readonly type = PolicyActionType.CustomPolicyAdded;

  constructor(public policy: Policy) {}
}

export class EditCustomPolicyAction implements Action {
  readonly type = PolicyActionType.EditCustomPolicy;

  constructor(public policyId: string, public modalData: CustomPolicy) {}
}

// ** Policies UPDATES **

export class PolicyUpdatedAction implements Action {
  readonly type = PolicyActionType.PolicyUpdated;

  constructor(public policyId: string, public policy: Policy) {}
}

export class BatchPolicyUpdatedAction implements Action {
  readonly type = PolicyActionType.BatchPoliciesUpdated;

  constructor(public batch: Policy[]) {}
}
// ** CUSTOM CONTROL REMOVAL **

export class RemoveCustomPolicyAction implements Action {
  readonly type = PolicyActionType.RemoveCustomPolicy;

  constructor(public policy: Policy) {}
}

export class CustomPolicyRemovedAction implements Action {
  readonly type = PolicyActionType.CustomPolicyRemoved;

  constructor(public policyId: string) {}
}

export class UpdatePolicyAction implements Action {
  readonly type = PolicyActionType.UpdatePolicy;

  constructor(public policyId: string) {}
}

// ** Policy Settings **
export class PolicySettingsUpdatedAction implements Action {
  readonly type = PolicyActionType.PolicySettingsUpdated;

  constructor(public policyId: string, public settingData: PolicySettings) {}
}
export class EditPolicySettingsAction implements Action {
  readonly type = PolicyActionType.EditPolicySettings;

  constructor(public policyId: string, public settingData: PolicySettings) {}
}
// ** Policy Approved on behalf **
export class ApproveOnBehalfUpdatedAction implements Action {
  readonly type = PolicyActionType.ApproveOnBehalfUpdated;

  constructor(public policyId: string, public approve: ApproveOnBehalf) {}
}
export class EditApproveOnBehalfAction implements Action {
  readonly type = PolicyActionType.EditApproveOnBehalf;

  constructor(public policyId: string, public approve: ApproveOnBehalf) {}
}

// ** Policy Share **
export class SharePolicyAction implements Action {
  readonly type = PolicyActionType.SharePolicy;

  constructor(public policyId: string, public policyShare: PolicyShare) {}
}

export class PolicySharedAction implements Action {
  readonly type = PolicyActionType.PolicyShared;

  constructor(public policyId: string, public payload: PolicyShare) {}
}

// ** ADAPTER ACTIONS - used in the reducer **

export const PoliciesAdapterActions = {
  policiesLoaded: createAction(PolicyActionType.PoliciesLoaded, props<{ policies: Policy[] }>()),
  customPolicyUpdated: createAction(PolicyActionType.PolicyUpdated, props<{ policyId: string; policy: Policy }>()),
  customPolicyRemoved: createAction(PolicyActionType.CustomPolicyRemoved, props<{ policyId: string }>()),
  customPolicyAdded: createAction(PolicyActionType.CustomPolicyAdded, props<{ policy: Policy }>()),
  batchPoliciesUpdated: createAction(PolicyActionType.BatchPoliciesUpdated, props<{ batch: Policy[] }>()),
  policySettingsUpdated: createAction(PolicyActionType.PolicySettingsUpdated, props<{ policyId: string; settings: PolicySettings; }>()),
};
