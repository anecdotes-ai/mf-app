/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';
import { CalculatedControl } from '../../models';
import { State } from '../state';
import { areNotLoaded } from '../utils';
import { Dictionary } from '@ngrx/entity';
import { Framework } from '../../models/domain';


// ** SELECTOR FUNCTIONS **

export const selectAllFrameworksFn = (state: State): Dictionary<Framework> => state.frameworksState.entities;
export const selectFrameworksInitStateFn = (state: State): boolean => state.frameworksState.initialized;

// ** SELECTORS **

export const selectAllExtendedFrameworks = createSelector(
  selectFrameworksInitStateFn,
  selectAllFrameworksFn,
  (isInitialized, frameworksDict, props: { extendedControls: { [frameworkId: string]: CalculatedControl[] } }): Framework[] => {
    if (areNotLoaded([frameworksDict], isInitialized)) {
      return;
    }
    const frameworks = Object.values(frameworksDict);

    return frameworks;
  }
);

export const selectExtendedFramework = createSelector(
  selectAllFrameworksFn,
  (
    frameworksDict,
    props: { extendedControls: { [frameworkId: string]: CalculatedControl[] }; frameworkId: string }
  ): Framework => {
    if (areNotLoaded([frameworksDict])) {
      return;
    }
    const framework = frameworksDict[props.frameworkId];

    return framework;
  }
);

export const createFrameworksByIdsSelector = (frameworkIds: string[]) =>
  createSelector(selectAllFrameworksFn, (entities) => frameworkIds.map((frameworkId) => entities[frameworkId]));
