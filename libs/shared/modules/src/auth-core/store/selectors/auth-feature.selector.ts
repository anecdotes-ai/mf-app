import { createFeatureSelector } from "@ngrx/store";
import { featureKey, AuthState } from '../state';

export const selectAuthFeature = createFeatureSelector<AuthState>(featureKey);
