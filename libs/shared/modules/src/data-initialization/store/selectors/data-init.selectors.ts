import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey } from '../constants';
import { InitFeatureState } from '../state';

const selectInitFeature = createFeatureSelector<InitFeatureState>(featureKey);
export const selectInitState = createSelector(selectInitFeature, initFeatureState => initFeatureState.initState);

