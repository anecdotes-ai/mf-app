import { Action, createAction, props } from '@ngrx/store';
import { ChangeApplicability } from '../../models';
import { Framework, AuditLog, StatusEnum, Audit, ExcludePlugin } from '../../models/domain';

export const FrameworkActionType = {
  ReloadFrameworks: '[Frameworks] Reload frameworks',
  FrameworksLoaded: '[Frameworks] Frameworks loaded',

  LoadSpecificFramework: '[Frameworks] Load Specific Framework',
  SpecificFrameworkLoaded: '[Framework] Specific Framework Loaded',

  FrameworkApplicabilityChange: '[Framework] Framework applicability change',
  FrameworkApplicabilityChangeFail: '[Framework] Framework applicability change fail',

  FrameworkUpdated: '[Framework] Framework updated',
  FrameworksBatchUpdated: '[Frameworks] Frameworks batch updated',

  FrameworkUpdateExcludedPluginsList: '[Framework] Framework was updated with new excluded plugins list',

  StartWithFrameworksAdoption: '[Framework] Start with frameworks adoption',
  StartWithAnecdotesEssentials: '[Framework] Start with anecdotes essentials',
  FrameworksAdopted: '[Framework] Frameworks adopted',

  BatchFrameworskUpdate: '[Frameworks] Batch frameworsk update',
  deleteFrameworkAudit: '[Framework] Delete framework audit',

  getFrameworkAuditHistory: '[Framework] Load framework audit history',
  frameworkAuditHistoryLoaded: '[Framework] Framework audit history loaded',

  changeFrameworkAuditStatus: '[Framework] Change framework audit status',

  setFrameworkAudit: '[Framework] Set framework audit',

  updateFrameworkAudit: '[Framework] Update framework audit',
  frameworkAuditUpdated: '[Framework] Framework audit updated',

  frameworkAuditEnded: '[Framework] Framework audit ended',
};

export class ReloadFrameworksAction implements Action {
  readonly type = FrameworkActionType.ReloadFrameworks;

  constructor() {}
}

export class LoadSpecificFrameworkAction implements Action {
  readonly type = FrameworkActionType.LoadSpecificFramework;

  constructor(public frameworkId: string) {}
}

export class FrameworksLoadedAction implements Action {
  readonly type = FrameworkActionType.FrameworksLoaded;

  constructor(public extendedFramework: Framework[]) {}
}

export class SpecificFrameworkLoadedAction implements Action {
  readonly type = FrameworkActionType.SpecificFrameworkLoaded;

  constructor(public extendedFramework: Framework) {}
}

export class FrameworkApplicabilityChangeAction implements Action {
  readonly type = FrameworkActionType.FrameworkApplicabilityChange;

  constructor(public framework: Framework) {}
}

export class FrameworkApplicabilityChangeFailAction implements Action {
  readonly type = FrameworkActionType.FrameworkApplicabilityChangeFail;

  constructor(public payload: ChangeApplicability) {}
}

export class FrameworkUpdatedAction {
  readonly type = FrameworkActionType.FrameworkUpdated;

  constructor(public framework: Framework) {}
}

export class FrameworksBatchUpdatedAction {
  readonly type = FrameworkActionType.FrameworksBatchUpdated;

  constructor(public batch: Framework[]) {}
}

export class StartWithFrameworksAdoptionAction {
  readonly type = FrameworkActionType.StartWithFrameworksAdoption;

  constructor(public frameworks: Framework[]) {}
}

export class StartWithAnecdotesEssentialsAction {
  readonly type = FrameworkActionType.StartWithAnecdotesEssentials;

  constructor() {}
}

export class FrameworksAdoptedAction {
  readonly type = FrameworkActionType.FrameworksAdopted;

  constructor(public frameworks: Framework[]) {}
}
export class FrameworkAuditEndedAction {
  readonly type = FrameworkActionType.frameworkAuditEnded;

  constructor(public auditLog: AuditLog) {}
}

export const BatchFrameworksUpdateAction = createAction(FrameworkActionType.BatchFrameworskUpdate, props<{frameworks: Framework[]}>());

export const FrameworksAdapterActions = {
  loadSpecificFramework: createAction(FrameworkActionType.LoadSpecificFramework, props<{ frameworkId: string }>()),
  frameworksLoaded: createAction(FrameworkActionType.FrameworksLoaded, props<{ extendedFramework: Framework[] }>()),
  specificFrameworkLoaded: createAction(
    FrameworkActionType.SpecificFrameworkLoaded,
    props<{ extendedFramework: Framework }>()
  ),
  applicabilityChange: createAction(
    FrameworkActionType.FrameworkApplicabilityChange,
    props<{ farmework: Framework }>()
  ),
  applicabilityChangeFail: createAction(
    FrameworkActionType.FrameworkApplicabilityChangeFail,
    props<{ payload: ChangeApplicability }>()
  ),
  frameworksBatchUpdated: createAction(FrameworkActionType.FrameworksBatchUpdated, props<{ batch: Framework[] }>()),
  frameworkUpdated: createAction(FrameworkActionType.FrameworkUpdated, props<{ framework: Framework }>()),
  frameworksAdopted: createAction(FrameworkActionType.FrameworksAdopted, props<{ frameworks: Framework[] }>()),
  deleteFrameworkAudit: createAction(FrameworkActionType.deleteFrameworkAudit, props<{ framework_id: string }>()),
  getFrameworkAuditHistory: createAction(FrameworkActionType.getFrameworkAuditHistory, props<{ framework_id: string, only_completed: boolean }>()),
  frameworkAuditHistoryLoaded: createAction(FrameworkActionType.frameworkAuditHistoryLoaded, props<{ framework_id: string, audit_logs: AuditLog[] }>()),
  changeFrameworkAuditStatus: createAction(FrameworkActionType.changeFrameworkAuditStatus, props<{ framework_id: string, status: StatusEnum }>()),
  setFrameworkAudit:  createAction(FrameworkActionType.setFrameworkAudit, props<{ framework_id: string, audit: Audit }>()),
  updateFrameworkAudit: createAction(FrameworkActionType.updateFrameworkAudit, props<{ framework_id: string, audit: Audit }>()),
  frameworkAuditUpdated: createAction(FrameworkActionType.frameworkAuditUpdated, props<{ audit: Audit }>()),
  frameworkAuditEnded: createAction(FrameworkActionType.frameworkAuditEnded, props<{ auditLog: AuditLog }>()),
  frameworkExcludedPluginsListUpdate: createAction(
    FrameworkActionType.FrameworkUpdateExcludedPluginsList,
    props<{  frameworkId: string, excludedPluginsListToUpdate: ExcludePlugin }>()
  ),
};
