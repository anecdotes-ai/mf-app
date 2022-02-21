import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createComposedResourceId } from '../../utils';
import { CommentingFeatureState, featureKey } from '../state';

export const featureSelector = createSelector(
  createFeatureSelector<CommentingFeatureState>(featureKey),
  (state) => state.commentingPanelState
);

export const selectCommonLogData = createSelector(featureSelector, (state) => state.commonLogData);
export const selectResourcesDictionary = createSelector(featureSelector, (state) => state.resources.entities);
export const selectResources = createSelector(selectResourcesDictionary, (entities) => Object.values(entities));
export const selectThreadViewModels = createSelector(featureSelector, (state) => state.threadViewModels);
export const selectIsInitialized = createSelector(featureSelector, (state) => state.isInitialized);
export const selectThreadCreationFor = createSelector(featureSelector, (state) => state.threadCreationFor);
export const selectStateThreadsDisplayedBy = createSelector(featureSelector, (state) => state.stateThreadsDisplayedBy);
export const selectDisplayedThreadViewModels = createSelector(
  selectThreadViewModels,
  selectStateThreadsDisplayedBy,
  (threadViewModels, stateThreadsDisplayedBy) =>
    threadViewModels.filter((tvm) => tvm.isCreation || tvm.threadState === stateThreadsDisplayedBy)
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createResourceLogDataSelector = (resourceType: string, resourceId: string) =>
  createSelector(
    selectResourcesDictionary,
    (resourcesDictionary) => resourcesDictionary[createComposedResourceId(resourceType, resourceId)]?.logData
  );
