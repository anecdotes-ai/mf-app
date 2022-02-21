import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { AuditLog } from '../../models/domain';
import { FrameworksAdapterActions } from './../actions/frameworks.actions';

export interface AuditLogStoreEntity {
  framework_id: string;
  audit_history_logs: AuditLog[];
}

export type AuditLogsState = EntityState<AuditLogStoreEntity>;

function selectFrameworkId(auditLog: AuditLogStoreEntity): string {
  return auditLog.framework_id;
}

export const auditLogsAdapter: EntityAdapter<AuditLogStoreEntity> = createEntityAdapter<AuditLogStoreEntity>({
  selectId: selectFrameworkId,
});

const initialState: AuditLogsState = auditLogsAdapter.getInitialState();

const adapterReducer = createReducer(
  initialState,
  on(FrameworksAdapterActions.frameworkAuditHistoryLoaded, (state: AuditLogsState, action) => {
    return auditLogsAdapter.upsertOne(
      { framework_id: action.framework_id, audit_history_logs: action.audit_logs },
      state
    );
  }),
  on(FrameworksAdapterActions.frameworkAuditEnded, (state: AuditLogsState, action) => {
    const auditLogsStateEntity = state.entities[action.auditLog.framework_id];
    const updatedAgentsStateEntity = auditLogsStateEntity
      ? [action.auditLog, ...auditLogsStateEntity.audit_history_logs]
      : [action.auditLog];
    return auditLogsAdapter.upsertOne(
      { framework_id: action.auditLog.framework_id, audit_history_logs: updatedAgentsStateEntity },
      state
    );
  })
);

export function auditLogsReducer(state = initialState, action: Action): AuditLogsState {
  return adapterReducer(state, action);
}
