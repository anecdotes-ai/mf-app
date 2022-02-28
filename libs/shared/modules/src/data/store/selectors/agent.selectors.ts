import { createSelector } from "@ngrx/store";
import { dataFeatureSelector } from './feature.selector';

const SelectAgentState = createSelector(dataFeatureSelector, dataFeatureState => dataFeatureState.agentState);

export const AgentSelectors = {
    SelectAgentState
};