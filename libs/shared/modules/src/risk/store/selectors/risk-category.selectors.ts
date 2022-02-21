import { createSelector } from '@ngrx/store';
import { featureSelector } from './feature-selector';

const selectRiskCategoryEntities = createSelector(featureSelector, state => state.riskDataState.riskCategories.entities);

export const RiskCategorySelectors = {
    selectAll: createSelector(selectRiskCategoryEntities, entities => Object.values(entities)),
    createByIdSelector: (categoryId: string) => createSelector(selectRiskCategoryEntities, entities => entities[categoryId])
};
