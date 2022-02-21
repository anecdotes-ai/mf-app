import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { CalculatedControl, CalculatedEvidence, CalculatedPolicy, CalculatedRequirement } from '../../models';
import {
  ControlSnapshotAddedAction,
  ControlsSnapshotsAddedAction,
  EvidenceSnapshotAddedAction,
  PoliciesSnapshotAddedAction,
  RequirementsSnapshotAddedAction,
  ReloadSnapshotStateAction,
  FrameworkSnapshotAddedAction
} from '../actions/snapshots.actions';
import { Framework } from 'core/modules/data/models/domain';

export interface SnapshotState {
  firstLoad: boolean,
  calculatedControls: EntityState<CalculatedControl>;
  calculatedRequirements: EntityState<CalculatedRequirement>;
  calculatedFrameworks: EntityState<Framework>;
  calculatedEvidences: EntityState<CalculatedEvidence>;
  calculatedPolicies: EntityState<CalculatedPolicy>;
}

function selectControlId(c: CalculatedControl): string {
  return c.snapshot_id;
}

function selectRequirementId(r: CalculatedRequirement): string {
  return r.snapshot_id;
}

function selectFrameworkId(f: Framework): string {
  return f.snapshot_id;
}

function selectEvidenceId(e: CalculatedEvidence): string {
  return e.snapshot_id;
}

function selectPolicyId(p: CalculatedPolicy): string {
  return p.snapshot_id;
}
const controlAdapter: EntityAdapter<CalculatedControl> = createEntityAdapter<CalculatedControl>({
  selectId: selectControlId,
});

const requirementAdapter: EntityAdapter<CalculatedRequirement> = createEntityAdapter<CalculatedRequirement>({
  selectId: selectRequirementId,
});

const frameworkAdapter: EntityAdapter<Framework> = createEntityAdapter<Framework>({
  selectId: selectFrameworkId,
});

const evidenceAdapter: EntityAdapter<CalculatedEvidence> = createEntityAdapter<CalculatedEvidence>({
  selectId: selectEvidenceId,
});

const policyAdapter: EntityAdapter<CalculatedPolicy> = createEntityAdapter<CalculatedPolicy>({
  selectId: selectPolicyId,
});

const initialState: SnapshotState = {
  firstLoad: false,
  calculatedControls: controlAdapter.getInitialState(),
  calculatedRequirements: requirementAdapter.getInitialState(),
  calculatedFrameworks: frameworkAdapter.getInitialState(),
  calculatedEvidences: evidenceAdapter.getInitialState(),
  calculatedPolicies: policyAdapter.getInitialState()
};

export const snapshotReducer = createReducer(
  initialState,
  on(ControlSnapshotAddedAction, (state: SnapshotState, action: { control }) => {
    return {
      ...state,
      calculatedControls: controlAdapter.addOne(action.control, state.calculatedControls)
    };
  }),
  on(EvidenceSnapshotAddedAction, (state: SnapshotState, action: { evidence }) => {
    return {
      ...state,
      calculatedEvidences: evidenceAdapter.addMany(action.evidence, state.calculatedEvidences)
    };
  }),
  on(RequirementsSnapshotAddedAction, (state: SnapshotState, action: { requirements }) => {
    return {
      ...state,
      calculatedRequirements: requirementAdapter.addMany(action.requirements, state.calculatedRequirements)
    };
  }),
  on(PoliciesSnapshotAddedAction, (state: SnapshotState, action: { policies }) => {
    return {
      ...state,
      calculatedPolicies: policyAdapter.addMany(action.policies, state.calculatedPolicies)
    };
  }),
  on(ControlsSnapshotsAddedAction, (state: SnapshotState, action: { controls }) => {
    return {
      ...state,
      firstLoad: true,
      calculatedControls: controlAdapter.upsertMany(action.controls, state.calculatedControls)
    };
  }),
  on(ReloadSnapshotStateAction, (state: SnapshotState, action: {}) => {
    return {
      ...state,
      firstLoad: false,
    };
  }),
  on(FrameworkSnapshotAddedAction, (state: SnapshotState, action: { framework }) => {
    return {
      ...state,
      calculatedFrameworks: frameworkAdapter.addOne(action.framework, state.calculatedFrameworks)
    };
  }),
);
