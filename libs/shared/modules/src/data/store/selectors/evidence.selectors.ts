/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { convertToEvidenceLike, EvidenceLike } from '../../models';
import { State } from '../state';

export const selectEvidenceLikeDictionary = createSelector(
  (state: State) => state.evidencesState,
  (state: State) => state.policyState,
  (evidenceState, policyState) => {
    const evidenceLikeDictionary = {} as Dictionary<EvidenceLike>;

    const evidenceEvidenceLikes = evidenceState.evidences.ids.map((id) =>
      convertToEvidenceLike(evidenceState.evidences.entities[id])
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

export const selectAllEvidenceLikes = createSelector(selectEvidenceLikeDictionary, (dictionary) =>
  Object.values(dictionary)
);
export const createEvidenceLikesSelectorByIds = (evidenceIds: string[]) =>
  createSelector(selectEvidenceLikeDictionary, (dictionary) =>
    Array.from(new Set(evidenceIds))
      .map((id) => dictionary[id])
      .filter((evidence) => evidence)
  );

export const createEvidenceLikeSelectorById = (evidenceId: string) =>
  createSelector(selectEvidenceLikeDictionary, (dictionary) => dictionary[evidenceId]);
