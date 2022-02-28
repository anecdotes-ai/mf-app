/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { convertToEvidenceLike, EvidenceLike } from '../../models';
import { dataFeatureSelector } from './feature.selector';
import { PolicySelectors } from './policy.selectors';

const SelectEvidenceState = createSelector(dataFeatureSelector, (dataFeatureState => dataFeatureState.evidencesState));
const SelectEvidenceDictionary = createSelector(SelectEvidenceState, (evidenceState) => evidenceState.evidences.entities);
const SelectEvidences = createSelector(SelectEvidenceDictionary, (evidenceDictionary) => Object.values(evidenceDictionary));
const SelectEvidenceLikeDictionary = createSelector(
  SelectEvidences,
  PolicySelectors.SelectPolicyState,
  (evidences, policyState) => {
    const evidenceLikeDictionary = {} as Dictionary<EvidenceLike>;

    const evidenceEvidenceLikes = evidences.map((evidence) =>
      convertToEvidenceLike(evidence)
    );
    const policiesEvidenceLikes = policyState.policies.ids
      .map((id) => policyState.policies.entities[id])
      .filter((policy) => policy.evidence)
      .map((policy) => convertToEvidenceLike(policy));

    evidenceEvidenceLikes.concat(policiesEvidenceLikes).forEach((evidenceLike) => {
      evidenceLikeDictionary[evidenceLike.id] = evidenceLike;
    });

    return evidenceLikeDictionary;
  }
);

const SelectAllEvidenceLikes = createSelector(SelectEvidenceLikeDictionary, (dictionary) =>
  Object.values(dictionary)
);
const CreateEvidenceLikesSelectorByIds = (evidenceIds: string[]) =>
  createSelector(SelectEvidenceLikeDictionary, (dictionary) =>
    Array.from(new Set(evidenceIds))
      .map((id) => dictionary[id])
      .filter((evidence) => evidence)
  );

const CreateEvidenceLikeSelectorById = (evidenceId: string) =>
  createSelector(SelectEvidenceLikeDictionary, (dictionary) => dictionary[evidenceId]);

export const EvidenceSelectors = {
  CreateEvidenceLikeSelectorById,
  CreateEvidenceLikesSelectorByIds,
  SelectAllEvidenceLikes,
  SelectEvidenceLikeDictionary,
  SelectEvidenceState,
  SelectEvidences
};
