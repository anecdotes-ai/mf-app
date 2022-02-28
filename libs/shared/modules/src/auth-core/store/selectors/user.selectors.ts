import { createSelector } from "@ngrx/store";
import { selectAuthFeature } from './auth-feature.selector';

const SelectUserState = createSelector(selectAuthFeature, authFeatureState => authFeatureState.userState);

export const UserSelectors = {
    SelectUserState
};
