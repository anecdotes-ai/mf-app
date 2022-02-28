import { createSelector } from '@ngrx/store';
import {dataFeatureSelector} from './feature.selector';

const SelectCalculationState = createSelector(dataFeatureSelector, dataFeatureState => dataFeatureState.calculationState);
const SelectCalculatedRequirements = createSelector(SelectCalculationState, calculationState => calculationState.calculatedRequirements);
const SelectCalculatedControls = createSelector(SelectCalculationState, calculationState => calculationState.calculatedControls);
const SelectCalculatedPolicies = createSelector(SelectCalculationState, calculationState => calculationState.calculatedPolicies);

export const CalculationSelectors = {
    SelectCalculationState,
    SelectCalculatedRequirements,
    SelectCalculatedControls,
    SelectCalculatedPolicies
};
