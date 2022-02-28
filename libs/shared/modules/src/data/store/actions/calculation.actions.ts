import { Action, createAction, props } from '@ngrx/store';
import { CalculatedControl, CalculatedPolicy, CalculatedRequirement } from '../../models';

export const CalculationActionType = {
  ControlCalculated: '[Calculation] Control calculated',
  RequirementCalculated: '[Calculation] Requirement calculated',
  PoliciesCalculated: '[Calculation] Policies calculated'
};

export class ControlsCalculatedAction implements Action {
  readonly type = CalculationActionType.ControlCalculated;
  constructor(public readonly calculatedControls: CalculatedControl[]) {}
}

export class RequirementsCalculatedAction implements Action {
  readonly type = CalculationActionType.RequirementCalculated;
  constructor(public readonly calculatedRequirements: CalculatedRequirement[]) {}
}

export class PoliciesCalculatedAction implements Action {
  readonly type = CalculationActionType.PoliciesCalculated;
  constructor(public readonly calculatedPolicies: CalculatedPolicy[]) {}
}

export const CalculationAdapterActions = {
    controlsCalculated: createAction(CalculationActionType.ControlCalculated, props<{ calculatedControls: CalculatedControl[] }>()),
    requirementsCalculated: createAction(CalculationActionType.RequirementCalculated, props<{ calculatedRequirements: CalculatedRequirement[] }>()),
    policiesCalculated: createAction(CalculationActionType.PoliciesCalculated, props<{ calculatedPolicies: CalculatedPolicy[] }>()),
};
