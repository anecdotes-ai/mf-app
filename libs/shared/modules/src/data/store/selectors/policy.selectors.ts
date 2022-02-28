/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';
import { Policy } from 'core/modules/data/models/domain';
import { PolicyState } from 'core/modules/data/store/reducers';
import { dataFeatureSelector } from './feature.selector';

const SelectPolicyState = createSelector(dataFeatureSelector, dataFeatureState => dataFeatureState.policyState);

const SelectPolicyById = (policyId: string) => createSelector(
  SelectPolicyState,
  ({ policies }: PolicyState): Policy | null => policies.entities[policyId] || null,
);

export const PolicySelectors = {
  SelectPolicyState,
  SelectPolicyById
};
