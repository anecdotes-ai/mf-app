import { Action, createAction, props } from '@ngrx/store';
import { Control, ControlRequirement, Requirement } from '../../models/domain';

export const RequirementsActionType = {
  LoadControlRequirements: '[Control Requirements] Load Requirements',
  ControlRequirementsLoaded: '[Control Requirements] Requirements loaded',

  ControlRequirementApplicabilityChange: '[Control Requirement] Control requirement applicability state change',
  ControlRequirementApplicabilityChanged: '[Control Requirement] Requirement applicability changed',

  ControlRequirementBatchUpdated: '[Control Requirement] Batch Updated',

  SendRequirementTaskSlack: '[Control Requirement] Send slack task',
  DismissRequirementTaskSlack: '[Control Requirement] Dissmiss slack task',

  ChangeApproval: '[Control Requirement] Change Requirement Approval',

  RemoveRequirement: '[Control Requirement] Remove Requirement',
  RequirementRemoved: '[Control Requirement] Requirement removed',

  AddRequirement: '[Requirement] Add Requirement',
  RequirementsAdded: '[Requirement] Requirement added',
  RequirementIndexChanged: '[Requirement] Requirement index changed',

  PatchRequirement: '[Requirement] Patch requirement',

  BatchUpdateRequirement: '[Requirement] Update Requirement',
  RequirementBatchUpdated: '[Requirement] Requirement Updated',

  AttachPolicyToRequirement: '[Requirement] Requirement policy attach',
  RemovePolicyFromRequirement: '[Requirement] Requirement policy removed',
  PolicyIndexChanged: '[Requirement] Policy index changed',
};

// ** CONTROL REQUIREMENT LOADING **
export class ControlRequirementsLoadedAction implements Action {
  readonly type = RequirementsActionType.ControlRequirementsLoaded;

  constructor(public controlRequirements: ControlRequirement[]) {}
}

// ** SLACK RELATED **
export class SendRequirementTaskSlackAction implements Action {
  readonly type = RequirementsActionType.SendRequirementTaskSlack;

  constructor(
    public requirement_id: string,
    public message: string,
    public messageReceivers: string[]
  ) {}
}

export class DismissRequirementTaskSlackAction implements Action {
  readonly type = RequirementsActionType.DismissRequirementTaskSlack;

  constructor(public control_id: string, public controlRequirement: ControlRequirement) {}
}

// ** CONTROL REQUIREMENTS STORE ENTITY UPDATES **
export class ControlRequirementBatchUpdatedAction implements Action {
  readonly type = RequirementsActionType.ControlRequirementBatchUpdated;

  constructor(public controlRequirementBatch: ControlRequirement[]) {}
}

// ** CONTROL REQUIREMENTS APPROVAL ACTIONS **
export class ChangeApprovalAction implements Action {
  readonly type = RequirementsActionType.ChangeApproval;

  constructor(public control: Control, public requirement: ControlRequirement) {}
}

// ** CONTROL REQUIREMENT APPLICABILITY CHANGES **
export class ControlRequirementApplicabilityChangeAction implements Action {
  readonly type = RequirementsActionType.ControlRequirementApplicabilityChange;

  constructor(public requirement: ControlRequirement) {}
}

export class ControlRequirementApplicabilityChangedAction implements Action {
  readonly type = RequirementsActionType.ControlRequirementApplicabilityChanged;

  constructor(public controlRequirementId: string, public isApplicable: boolean) {}
}

// ** CONTROL REQUIREMENT REMOVAL **
export class RemoveRequirementAction implements Action {
  readonly type = RequirementsActionType.RemoveRequirement;

  constructor(public requirement_id: string, public control_id: string) {}
}

export class RequirementRemovedAction implements Action {
  readonly type = RequirementsActionType.RequirementRemoved;

  constructor(public requirement_id: string, public control_id: string) {}
}

// ** REQUIREMENT ADDITION **
export class AddRequirementAction implements Action {
  readonly type = RequirementsActionType.AddRequirement;

  constructor(public payload: AddRequirementPayload) {}
}

export class RequirementAddedAction implements Action {
  readonly type = RequirementsActionType.RequirementsAdded;

  constructor(public requirement: ControlRequirement, public requirementRelatedControlIds: string[]) {}
}

export class RequirementIndexChangedAction implements Action {
  readonly type = RequirementsActionType.RequirementIndexChanged;

  // Where key is requirement id and value is array of controls that refer tho the requirement
  constructor(public index: { [requirement_id: string]: string[] }) {}
}

// ** REQUIREMENT POLICY **
export class AttachRequirementPolicy implements Action {
  readonly type = RequirementsActionType.AttachPolicyToRequirement;

  constructor(public requirement: ControlRequirement, public policyId: string) {}
}

export class RemoveRequirementPolicy implements Action {
  readonly type = RequirementsActionType.RemovePolicyFromRequirement;

  constructor(public requirement: ControlRequirement, public policyId: string) {}
}

// ** REQUIREMENT - UPDATES
export class BatchUpdateRequirements implements Action {
  readonly type = RequirementsActionType.BatchUpdateRequirement;

  constructor(public requirement_ids: string[]) {}
}
export class RequirementBatchUpdated implements Action {
  readonly type = RequirementsActionType.RequirementBatchUpdated;

  constructor(public requirement_ids: string[], public requirements: ControlRequirement[]) {}
}

// ** REQUIREMENT ADAPTER - used by the reducer **

export const RequirementsAdapterActions = {
  controlRequirementsLoaded: createAction(
    RequirementsActionType.ControlRequirementsLoaded,
    props<{ controlRequirements: ControlRequirement[] }>()
  ),
  controlRequirementsAdded: createAction(
    RequirementsActionType.RequirementsAdded,
    props<{ requirement: Requirement; requirementRelatedControlIds: string[] }>()
  ),
  patchRequirement: createAction(
    RequirementsActionType.PatchRequirement,
    props<{ requirement_id: string, requirement: Requirement }>()
  ),
  controlRequirementBatchUpdated: createAction(
    RequirementsActionType.ControlRequirementBatchUpdated,
    props<{ controlRequirementBatch: ControlRequirement[] }>()
  ),
  controlRequirementApplicabilityChanged: createAction(
    RequirementsActionType.ControlRequirementApplicabilityChanged,
    props<{ controlRequirementId: string; isApplicable: boolean }>()
  ),
  requirementRemoved: createAction(
    RequirementsActionType.RequirementRemoved,
    props<{ requirement_id: string; control_id: string }>()
  ),
  requirementBatchUpdated: createAction(
    RequirementsActionType.RequirementBatchUpdated,
    props<{ requirement_ids: string[]; requirements: ControlRequirement[] }>()
  ),
  requirementIndexChanged: createAction(
    RequirementsActionType.RequirementIndexChanged,
    props<{ index: { [requirement_id: string]: string[] } }>()
  ),
  policyIndexChanged: createAction(
    RequirementsActionType.PolicyIndexChanged,
    props<{ index: { [policy_id: string]: string[] } }>()
  ),
};

export interface AddRequirementPayload {
  requirement: Requirement;
  isExistingRequirement?: boolean;
}
