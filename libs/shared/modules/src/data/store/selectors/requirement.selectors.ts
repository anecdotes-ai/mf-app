/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EntityState } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { ControlRequirement } from '../../models/domain';
import { dataFeatureSelector } from './feature.selector';

// ** SELECTOR FUNCTIONS ***

const SelectRequirementState = createSelector(dataFeatureSelector, dataFeatureState => dataFeatureState.requirementState);
 const SelectRequirementsInitState = createSelector(SelectRequirementState, (requirementState): boolean => requirementState.initialized);
 const SelectControlRequirements = createSelector(SelectRequirementState, (requirementState): EntityState<ControlRequirement> =>
  requirementState.controlRequirements);
 const SelectRequirementControlsMapping = createSelector(SelectRequirementState, (requirementState): { [key: string]: string[] } =>
  requirementState.requirementControlsMapping);
 const SelectPolicyRequirementsMapping = createSelector(SelectRequirementState, (requirementState): { [key: string]: string[] } =>
  requirementState.policyRequirementsMapping);

// ** SELECTORS **

 const SelectRequirements = createSelector(
  SelectRequirementsInitState,
  SelectControlRequirements,
  (isInitialized, requirements) => {
    return isInitialized ? Object.values(requirements.entities) : null;
  }
);

 const SelectRequirementRelatedControlIds = createSelector(
  SelectRequirementControlsMapping,
  (requirementControlsMapping, props: { requirement_id: string }) => {
    return requirementControlsMapping[props.requirement_id];
  }
);

 const SelectPolicyRelatedRequirementIds = createSelector(
  SelectPolicyRequirementsMapping,
  (selectPolicyRequirementsMapping) => selectPolicyRequirementsMapping
);

 const SelectEvidenceRequirementMapping = createSelector(SelectRequirements, (requirements) => {
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

 const CreateRequirementsByEvidenceIdSelector = (evidenceId: string) =>
  createSelector(SelectEvidenceRequirementMapping, (mapping) => {
    const relatedRequirements = mapping[evidenceId];

    if (relatedRequirements) {
      return relatedRequirements.filter((req) => req);
    }

    return [];
  });

 const CreateRequirementByIdsSelector = (requirementIds: string[]) =>
  createSelector(SelectControlRequirements, (st) => {
    return Array.from(new Set(requirementIds)).map((id) => st.entities[id]).filter(req => req);
  });

const SelectRequirementsDictionary = createSelector(SelectRequirementState, requirementState => requirementState.controlRequirements.entities);

const CreateRequirementSelector = (requirementId: string) =>
    createSelector(SelectRequirementsDictionary, (dic) => dic[requirementId]);

export const RequirementSelectors = {
  SelectRequirementState,
  SelectRequirementsInitState,
  SelectControlRequirements,
  SelectRequirementControlsMapping,
  SelectPolicyRequirementsMapping,
  SelectRequirements,
  SelectRequirementRelatedControlIds,
  SelectPolicyRelatedRequirementIds,
  SelectEvidenceRequirementMapping,
  CreateRequirementsByEvidenceIdSelector,
  CreateRequirementByIdsSelector,
  CreateRequirementSelector
};
