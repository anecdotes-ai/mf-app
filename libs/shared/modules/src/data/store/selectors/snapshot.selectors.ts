import { createSelector } from "@ngrx/store";
import { dataFeatureSelector } from "./feature.selector";

const SelectSnapshotState = createSelector(dataFeatureSelector, dataFeatureState => dataFeatureState.snapshotState);
const SelectSnapshotEvidenceState = createSelector(SelectSnapshotState, snapshotState => snapshotState.evidences);

export const SnapshotSelectors = {
    SelectSnapshotState,
    SelectSnapshotEvidenceState
};
