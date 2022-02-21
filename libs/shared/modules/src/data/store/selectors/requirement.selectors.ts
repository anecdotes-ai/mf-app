/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EntityState } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { ControlRequirement } from '../../models/domain';
import { State } from '../state';

// ** SELECTOR FUNCTIONS ***

export const selectRequirementsInitState = (state: State): boolean => state.requirementState.initialized;
export const selectControlRequirements = (state: State): EntityState<ControlRequirement> =>
  state.requirementState.controlRequirements;
export const selectRequirementControlsMapping = (state: State): { [key: string]: string[] } =>
  state.requirementState.requirementControlsMapping;
export const selectPolicyRequirementsMapping = (state: State): { [key: string]: string[] } =>
  state.requirementState.policyRequirementsMapping;

// ** SELECTORS **

export const selectRequirements = createSelector(
  selectRequirementsInitState,
  selectControlRequirements,
  (isInitialized, requirements) => {
    return isInitialized ? Object.values(requirements.entities) : null;
  }
);

export const selectRequirementRelatedControlIds = createSelector(
  selectRequirementControlsMapping,
  (requirementControlsMapping, props: { requirement_id: string }) => {
    return requirementControlsMapping[props.requirement_id];
  }
);

export const selectPolicyRelatedRequirementIds = createSelector(
  selectPolicyRequirementsMapping,
  (selectPolicyRequirementsMapping) => selectPolicyRequirementsMapping
);

export const selectEvidenceRequirementMapping = createSelector(selectRequirements, (requirements) => {
  let result: { [evidenceId: string]: ControlRequirement[] };

  if (requirements) {
    result = {};

    requirements.forEach((req) => {
      req.requirement_evidence_ids.forEach((evidenceId) => {
        result[evidenceId] = result[evidenceId] ? [...result[evidenceId], req] : [req];
      });
    });
  } else {
    result = null;
  }

  return result;
});

export const createRequirementsByEvidenceIdSelector = (evidenceId: string) =>
  createSelector(selectEvidenceRequirementMapping, (mapping) => {
    const relatedRequirements = mapping[evidenceId];

    if (relatedRequirements) {
      return relatedRequirements.filter((req) => req);
    }

    return [];
  });

export const createRequirementByIdsSelector = (requirementIds: string[]) =>
  createSelector(selectControlRequirements, (st) => {
    return Array.from(new Set(requirementIds)).map((id) => st.entities[id]).filter(req => req);
  });

const selectRequirementsDictionary = (state: State) => state.requirementState.controlRequirements.entities;

export const createRequirementSelector = (requirementId: string) =>
    createSelector(selectRequirementsDictionary, (dic) => dic[requirementId]);
