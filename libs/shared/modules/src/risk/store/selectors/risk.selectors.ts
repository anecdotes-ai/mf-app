import { createSelector } from "@ngrx/store";
import { featureSelector } from "./feature-selector";

const selectRiskEntities = createSelector(featureSelector, state => state.riskDataState.risks.entities);

export const RiskSelectors = {
    selectAll: createSelector(selectRiskEntities, entities => Object.values(entities)),
    createByIdSelector: (riskId: string) => createSelector(selectRiskEntities, entities => entities[riskId])
};
