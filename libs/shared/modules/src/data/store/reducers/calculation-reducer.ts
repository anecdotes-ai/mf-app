import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { CalculatedControl, CalculatedEvidence, CalculatedPolicy, CalculatedRequirement } from '../../models';
import {
  CalculationAdapterActions,
  ControlsCalculatedAction,
  RequirementsCalculatedAction,
} from '../actions/calculation.actions';
import { EvidenceCalculatedAction, PoliciesCalculatedAction } from './../actions/calculation.actions';

export interface CalculationState {
  calculatedControls: EntityState<CalculatedControl>;
  calculatedRequirements: EntityState<CalculatedRequirement>;
  calculatedEvidences: EntityState<CalculatedEvidence>;
  calculatedPolicies: EntityState<CalculatedPolicy>;
  areEvidenceCalculated: boolean;
  arePoliciesCalculated: boolean;
  areControlsCalculated: boolean;
}

function selectControlId(c: CalculatedControl): string {
  return c.control_id;
}

function selectRequirementId(r: CalculatedRequirement): string {
  return r.requirement_id;
}

function selectEvidenceId(e: CalculatedEvidence): string {
  return e.evidence_id;
}

function selectPolicyId(p: CalculatedPolicy): string {
  return p.policy_id;
}
const controlAdapter: EntityAdapter<CalculatedControl> = createEntityAdapter<CalculatedControl>({
  selectId: selectControlId,
});

const requirementAdapter: EntityAdapter<CalculatedRequirement> = createEntityAdapter<CalculatedRequirement>({
  selectId: selectRequirementId,
});

const evidenceAdapter: EntityAdapter<CalculatedEvidence> = createEntityAdapter<CalculatedEvidence>({
  selectId: selectEvidenceId,
});

const policyAdapter: EntityAdapter<CalculatedPolicy> = createEntityAdapter<CalculatedPolicy>({
  selectId: selectPolicyId,
});

const initialState: CalculationState = {
  calculatedControls: controlAdapter.getInitialState(),
  calculatedRequirements: requirementAdapter.getInitialState(),
  calculatedEvidences: evidenceAdapter.getInitialState(),
  calculatedPolicies: policyAdapter.getInitialState(),
  areEvidenceCalculated: false,
  arePoliciesCalculated: false,
  areControlsCalculated: false,
};

export const calculationReducer = createReducer(
  initialState,
  on(CalculationAdapterActions.controlsCalculated, (state: CalculationState, action: ControlsCalculatedAction) => {
    const stateAfterRemoving = controlAdapter.removeAll(state.calculatedControls);

    return {
      ...state,
      areControlsCalculated: true,
      calculatedControls: controlAdapter.addMany(action.calculatedControls, stateAfterRemoving),
    };
  }),
  on(
    CalculationAdapterActions.requirementsCalculated,
    (state: CalculationState, action: RequirementsCalculatedAction) => {
      const stateAfterRemoving = requirementAdapter.removeAll(state.calculatedRequirements);

      return {
        ...state,
        calculatedRequirements: requirementAdapter.addMany(action.calculatedRequirements, stateAfterRemoving),
      };
    }
  ),
  on(CalculationAdapterActions.evidenceCalculated, (state: CalculationState, action: EvidenceCalculatedAction) => {
    const stateAfterRemoving = evidenceAdapter.removeAll(state.calculatedEvidences);

    return {
      ...state,
      areEvidenceCalculated: true,
      calculatedEvidences: evidenceAdapter.addMany(action.calculatedEvidence, stateAfterRemoving),
    };
  }),
  on(CalculationAdapterActions.policiesCalculated, (state: CalculationState, action: PoliciesCalculatedAction) => {
    const stateAfterRemoving = policyAdapter.removeAll(state.calculatedPolicies);

    return {
      ...state,
      arePoliciesCalculated: true,
      calculatedPolicies: policyAdapter.addMany(action.calculatedPolicies, stateAfterRemoving),
    };
  })
);
