import { createSelector } from "@ngrx/store";
import { featureSelector } from "./feature-selector";

const selectRiskSourceEntities = createSelector(featureSelector, state => state.riskDataState.riskSources.entities);

export const RiskSourceSelectors = {
    selectAll: createSelector(selectRiskSourceEntities, entities => Object.values(entities)),
    createByIdSelector: (sourceId) => createSelector(selectRiskSourceEntities, (entities) => entities[sourceId])
};
