import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { ControlRequirement } from '../../models/domain';
import { selectRequirementId } from '../../utils';
import {
  ControlRequirementBatchUpdatedAction,
  ControlRequirementsLoadedAction,
  RequirementAddedAction,
  RequirementBatchUpdated,
  RequirementRemovedAction,
  RequirementsAdapterActions,
} from '../actions/requirements.actions';

const controlRequirementAdapter = createEntityAdapter<ControlRequirement>({
  selectId: selectRequirementId,
});

export interface RequirementsState {
  controlRequirements: EntityState<ControlRequirement>;
  initialized: boolean;
  requirementControlsMapping: { [requirement_id: string]: string[] };
  policyRequirementsMapping: { [policy_id: string]: string[] };
}

const initialState: RequirementsState = {
  controlRequirements: controlRequirementAdapter.getInitialState(),
  requirementControlsMapping: {},
  policyRequirementsMapping: {},
  initialized: false,
};

const adapterReducer = createReducer(
  initialState,
  on(
    RequirementsAdapterActions.controlRequirementsLoaded,
    (state: RequirementsState, action: ControlRequirementsLoadedAction) => {
      return {
        ...state,
        controlRequirements: controlRequirementAdapter.upsertMany(
          action.controlRequirements,
          state.controlRequirements
        ),
        initialized: true,
      };
    }
  ),
  on(
    RequirementsAdapterActions.controlRequirementsAdded,
    (state: RequirementsState, action: RequirementAddedAction) => {
      const requirementControlsMapping = { ...state.requirementControlsMapping };
      requirementControlsMapping[action.requirement.requirement_id] = action.requirementRelatedControlIds;

      return {
        ...state,
        controlRequirements: controlRequirementAdapter.addOne(action.requirement, state.controlRequirements),
        requirementControlsMapping,
      };
    }
  ),
  on(
    RequirementsAdapterActions.requirementBatchUpdated,
    (state: RequirementsState, action: RequirementBatchUpdated) => {
      return {
        ...state,
        controlRequirements: controlRequirementAdapter.updateMany(
          action.requirements.map((r) => ({ id: r.requirement_id, changes: r })),
          state.controlRequirements
        ),
      };
    }
  ),
  on(RequirementsAdapterActions.requirementRemoved, (state: RequirementsState, action: RequirementRemovedAction) => {
    const requirementControlsMapping = { ...state.requirementControlsMapping };

    requirementControlsMapping[action.requirement_id] = requirementControlsMapping[action.requirement_id].filter(
      (control_id) => control_id === action.control_id
    );

    if (requirementControlsMapping[action.requirement_id].length) {
      return {
        ...state,
        requirementControlsMapping,
      };
    } else {
      return {
        ...state,
        controlRequirements: controlRequirementAdapter.removeOne(action.requirement_id, state.controlRequirements),
      };
    }
  }),
  on(
    RequirementsAdapterActions.controlRequirementBatchUpdated,
    (state: RequirementsState, action: ControlRequirementBatchUpdatedAction) => {
      return {
        ...state,
        controlRequirements: controlRequirementAdapter.updateMany(
          action.controlRequirementBatch.map((requirement) => ({
            id: selectRequirementId(requirement),
            changes: requirement,
          })),
          state.controlRequirements
        ),
      };
    }
  ),
  on(
    RequirementsAdapterActions.requirementIndexChanged,
    (state: RequirementsState, action) => {
      return {
        ...state,
        requirementControlsMapping: action.index,
      };
    }
  ),
  on(RequirementsAdapterActions.policyIndexChanged, (state: RequirementsState, action) => {
    return {
      ...state,
      policyRequirementsMapping: action.index,
    };
  })
);

export function requirementsReducer(state = initialState, action: Action): RequirementsState {
  return adapterReducer(state, action);
}
