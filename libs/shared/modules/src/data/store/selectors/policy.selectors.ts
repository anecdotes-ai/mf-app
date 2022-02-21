import { createSelector } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store/src/selector';
import { Policy } from 'core/modules/data/models/domain';
import { PolicyState } from 'core/modules/data/store/reducers';
import { State } from '../state';

export const selectPolicyState = ({ policyState }: State): PolicyState => policyState;

export const selectPolicyById = (policyId: string): MemoizedSelector<State, Policy | null> => createSelector(
  selectPolicyState,
  ({ policies }: PolicyState): Policy | null => policies.entities[policyId] || null,
);
