/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { Framework } from '../../models/domain';
import { dataFeatureSelector } from './feature.selector';

// ** SELECTOR FUNCTIONS **

const SelectFrameworkState = createSelector(dataFeatureSelector, dataFeatureState => dataFeatureState.frameworksState);
const SelectAllFrameworksFn = createSelector(SelectFrameworkState, (frameworksState): Dictionary<Framework> => frameworksState.entities);

// ** SELECTORS **

const CreateFrameworksByIdsSelector = (frameworkIds: string[]) =>
  createSelector(SelectAllFrameworksFn, (entities) => frameworkIds.map((frameworkId) => entities[frameworkId]));

export const FrameworkSelectors = {
  SelectFrameworkState,
  SelectAllFrameworksFn,
  CreateFrameworksByIdsSelector
};
