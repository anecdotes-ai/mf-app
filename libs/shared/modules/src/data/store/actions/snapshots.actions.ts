import { Control, ControlRequirement, EvidenceInstance, Framework, Policy } from './../../models/domain';
import { createAction, props, Action } from '@ngrx/store';

const SnapshotActionType = {
  AddControlSnapshot: '[Add Control Snapshot] Add Control Snapshot',
  ControlSnapshotAdded: '[Add Control Snapshot] Control Snapshot added',
  
  AddRequirementSnapshot: '[Add Requirement Snapshot] Add Requirement Snapshot',
  RequirementSnapshotAdded: '[Add Requirement Snapshot] Requirement Snapshot added',
  
  AddPolicySnapshot: '[Add Policy Snapshot] Add Policy Snapshot',
  PolicySnapshotAdded: '[Add Policy Snapshot] Policy Snapshot added',

  AddEvidenceSnapshot: '[Add Evidence Snapshot] Add Evidence Snapshot',
  EvidenceSnapshotAdded: '[Add Evidence Snapshot] Evidence Snapshot added',

  AddControlsSnapshots: '[Add Controls Snapshot] Add Controls Snapshot',
  ControlsSnapshotsAdded: '[Add Controls Snapshots] Controls Snapshots added',

  ReloadSnapshotState: '[Reload Snapshot State] Reload Snapshot State',

  AddFrameworkSnapshot: '[Add Framework Snapshot] Add Framework Snapshot',
  FrameworkSnapshotAdded: '[Add Framework Snapshot] Framework Snapshot Added',
};

export const AddControlSnapshotAction = createAction(
  SnapshotActionType.AddControlSnapshot, 
  props<{ control_id: string, snapshot_id: string }>());

export const ControlSnapshotAddedAction = createAction(
  SnapshotActionType.ControlSnapshotAdded, 
  props<{ control: Control }>());

export const AddRequirementsSnapshotAction = createAction(
  SnapshotActionType.AddRequirementSnapshot, 
  props<{ requirement_ids: string[] }>());

export const RequirementsSnapshotAddedAction = createAction(
  SnapshotActionType.RequirementSnapshotAdded, 
  props<{ requirements: ControlRequirement[] }>());

export const AddPoliciesSnapshotAction = createAction(
  SnapshotActionType.AddPolicySnapshot, 
  props<{ policies_ids: string[] }>());

export const PoliciesSnapshotAddedAction = createAction(
  SnapshotActionType.PolicySnapshotAdded, 
  props<{ policies: Policy[] }>());

export const AddEvidenceSnapshotAction = createAction(
  SnapshotActionType.AddEvidenceSnapshot, 
  props<{ evidence_id: string[] }>());

export const EvidenceSnapshotAddedAction = createAction(
  SnapshotActionType.EvidenceSnapshotAdded, 
  props<{ evidence: EvidenceInstance[] }>());

export const AddControlsSnapshotsAction = createAction(
  SnapshotActionType.AddControlsSnapshots, 
  props<{ control_ids: string[] }>());

export const ControlsSnapshotsAddedAction = createAction(
  SnapshotActionType.ControlsSnapshotsAdded, 
  props<{ controls: Control[] }>());

export const ReloadSnapshotStateAction = createAction(
  SnapshotActionType.ReloadSnapshotState);

export const AddFrameworkSnapshotAction = createAction(
  SnapshotActionType.AddFrameworkSnapshot, 
  props<{ snapshot_id: string }>());

export const FrameworkSnapshotAddedAction = createAction(
  SnapshotActionType.FrameworkSnapshotAdded, 
  props<{ framework: Framework }>());

