import { createFeatureSelector } from '@ngrx/store';
import { featureKey, RiskDataState } from '../state';

export const featureSelector = createFeatureSelector<RiskDataState>(featureKey);
