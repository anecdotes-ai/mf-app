import { createSelector } from "@ngrx/store";
import { dataFeatureSelector } from "./feature.selector";

const SelectAuditLogsState = createSelector(dataFeatureSelector, (dataFeatureState => dataFeatureState.auditLogsState));

export const AuditLogsSelector = {
    SelectAuditLogsState
};
