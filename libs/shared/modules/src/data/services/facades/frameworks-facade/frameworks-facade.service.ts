import { UserFacadeService } from './../../../../auth-core/services';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import { AnecdotesUnifiedFramework } from '../../../constants';
import { FrameworkStatus } from '../../../models';
import { FrameworkApplicabilityChangeAction, BatchFrameworksUpdateAction, FrameworksAdapterActions } from '../../../store/actions';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { UserEvents, FrameworksEventDataPropertyNames } from 'core/models/user-events/user-event-data.model';
import { Framework, StatusEnum, Audit, AuditLog, ExcludePlugin } from '../../../models/domain';
import { ActionDispatcherService } from './../../action-dispatcher/action-dispatcher.service';
import { TrackOperations } from '../../operations-tracker/constants/track.operations.list.constant';
import { FrameworksEventService } from '../../event-tracking/frameworks-event-service/frameworks-event-service';
import { AuditLogsSelector, FrameworkSelectors } from '../../../store/selectors';

@Injectable()
export class FrameworksFacadeService {
  private allFrameworksCache$: Observable<Framework[]>;

  constructor(private store: Store,
    private userFacade: UserFacadeService,
    private userEventService: UserEventService,
    private actionDispatcher: ActionDispatcherService,
    private frameworksEventService: FrameworksEventService) {
    this.setAllFrameworksCache();
  }

  /** Returns framework by framework id */
  getFrameworkById(framework_id: string): Observable<Framework> {
    return this.allFrameworksCache$.pipe(
      map((frameworks) => frameworks.find((framework) => framework.framework_id === framework_id)),
      filter((framework) => !!framework),
      shareReplay()
    );
  }

  getFrameworksByIds(frameworkIds: string[]): Observable<Framework[]> {
    return this.store.select(FrameworkSelectors.CreateFrameworksByIdsSelector(frameworkIds));
  }

  /** Returns framework by framework name */
  getFrameworkByName(frameworkName: string): Observable<Framework> {
    return this.allFrameworksCache$.pipe(
      map((frameworks) => frameworks.find((framework) => framework.framework_name === frameworkName)),
      filter((framework) => !!framework)
    );
  }

  /** Returns all frameworks except AnecdotesUnifiedFramework */
  getFrameworks(): Observable<Framework[]> {
    return this.allFrameworksCache$;
  }

  /** Returns all applicable frameworks. Anecdotes unified framework is not included */
  getApplicableFrameworks(): Observable<Framework[]> {
    return this.allFrameworksCache$.pipe(
      map((frameworks) => frameworks.filter((framework) => framework.is_applicable)),
      shareReplay()
    );
  }

  /** Returns all not applicable frameworks. Anecdotes unified framework is not included */
  getNotApplicableFrameworks(): Observable<Framework[]> {
    return this.allFrameworksCache$.pipe(
      map((frameworks) => frameworks.filter((framework) => !framework.is_applicable)),
      shareReplay()
    );
  }

  /** Returns all available frameworks. Anecdotes unified framework is not included */
  getAvailableFrameworks(): Observable<Framework[]> {
    return this.allFrameworksCache$.pipe(
      map((frameworks) => frameworks.filter((framework) => framework.framework_status === FrameworkStatus.AVAILABLE)),
      shareReplay()
    );
  }

  /** Returns all available and applicable frameworks including AnecdotesUnified. Anecdotes unified framework goes first */
  getAllUsableAndApplicableFrameworks(): Observable<Framework[]> {
    return this.allFrameworksCache$.pipe(
      map((frameworks) => frameworks.filter((f) => f.framework_status === FrameworkStatus.AVAILABLE)),
      // Remove AnecdotesUnifiedFramework from array. It will be added in the next step as first element
      map((frameworks) =>
        frameworks.filter((framework) => framework.framework_id !== AnecdotesUnifiedFramework.framework_id)
      ),
      map((frameworks) => [{ ...AnecdotesUnifiedFramework }, ...frameworks].filter((f) => f.is_applicable)),
      shareReplay()
    );
  }

  isFrameworkInAudit(framework_id: string): Observable<boolean> {
    return this.userFacade.auditorsExist(framework_id);
  }

  getAreFrameworksLoaded(): Observable<boolean> {
    return this.store.select(FrameworkSelectors.SelectFrameworkState).pipe(map((frameworksState) => frameworksState.initialized));
  }

  adoptFrameworkAsync(framework: Framework): Promise<void> {
    this.frameworksEventService.trackAddFrameworkClick(framework.framework_name);

    return this.changeFrameworkApplicabilityAsync(framework.framework_id, 'adopt');
  }

  abandonFrameworkAsync(framework: Framework): Promise<void> {
    this.frameworksEventService.trackRemoveFrameworkClick(framework.framework_name);

    return this.changeFrameworkApplicabilityAsync(framework.framework_id, 'abandon');
  }

  // Batch update for freeze/unfreeze framework - update the freeze data of all the sent frameworks and send to amplitude
  async changeBatchFrameworkFreezeData(frameworks: Framework[]): Promise<void> {
    const freezeFrameworks = frameworks.filter((framework) => framework.freeze).map((framework) => framework.framework_name);
    this.userEventService.sendEvent(UserEvents.FRAMEWORK_FREEZE_MODAL, {
      [FrameworksEventDataPropertyNames.SelectedFrameworks]: freezeFrameworks
    });
    await this.actionDispatcher.dispatchActionAsync(
      BatchFrameworksUpdateAction({frameworks}),
      TrackOperations.FRAMEWORKS_BATCH_UPDATE
    );

    await this.getApplicableFrameworks();
  }

  deleteFrameworkAudit(framework: Framework): Promise<void> {
    this.frameworksEventService.trackResetFrameworkAuditClick(
      framework.framework_name,
      framework.framework_current_audit.audit_date
    );

    return this.actionDispatcher.dispatchActionAsync(
      FrameworksAdapterActions.deleteFrameworkAudit({ framework_id: framework.framework_id }),
      TrackOperations.DELETE_FRAMEWORK_AUDIT,
      framework.framework_id
    );
  }

  endFrameworkAudit(framework: Framework): Promise<void> {
    this.frameworksEventService.trackEndFrameworkAuditClick(
      framework.framework_name,
      framework.framework_current_audit.audit_date,
      framework.framework_current_audit.framework_fields?.type
    );

    return this.actionDispatcher.dispatchActionAsync(
      FrameworksAdapterActions.changeFrameworkAuditStatus({
        framework_id: framework.framework_id,
        status: StatusEnum.COMPLETED,
      }),
      TrackOperations.UPDATE_FRAMEWORK_AUDIT_STATUS,
      framework.framework_id
    );
  }

  async setFrameworkAudit(framework: Framework, audit: Audit): Promise<void> {
    this.frameworksEventService.trackSetupFrameworkAuditClick(
      framework.framework_name,
      audit.audit_date,
      audit.framework_fields?.type,
      audit.framework_fields?.range_start
        ? [audit.framework_fields.range_start, audit.framework_fields.range_end]
        : null
    );

    return this.actionDispatcher.dispatchActionAsync(
      FrameworksAdapterActions.setFrameworkAudit({ framework_id: framework.framework_id, audit }),
      TrackOperations.SET_FRAMEWORK_AUDIT,
      framework.framework_id
    );
  }

  updateFrameworkAudit(framework: Framework, audit: Audit): Promise<void> {
    this.frameworksEventService.trackEditFrameworkAuditClick(
      framework.framework_name,
      audit.audit_date,
      audit.framework_fields?.type,
      audit.framework_fields?.range_start
        ? [audit.framework_fields.range_start, audit.framework_fields.range_end]
        : null
    );

    return this.actionDispatcher.dispatchActionAsync(
      FrameworksAdapterActions.updateFrameworkAudit({ framework_id: framework.framework_id, audit }),
      TrackOperations.UPDATE_FRAMEWORK_AUDIT,
      framework.framework_id
    );
  }

  async loadFrameworkAuditHistory(framework_id: string, only_completed?: boolean): Promise<void> {
    await this.actionDispatcher.dispatchActionAsync(
      FrameworksAdapterActions.getFrameworkAuditHistory({ framework_id, only_completed }),
      TrackOperations.LOAD_AUDIT_HISTORY,
      framework_id
    );
  }

  getFrameworkAuditHistory(frameworkId: string): Observable<AuditLog[]> {
    return this.store
      .select(AuditLogsSelector.SelectAuditLogsState)
      .pipe(map((auditLogsState) => auditLogsState.entities[frameworkId]?.audit_history_logs))
      .pipe(shareReplay());
  }

  frameworkAuditEnded(auditLog: AuditLog): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      FrameworksAdapterActions.frameworkAuditEnded({ auditLog }),
      TrackOperations.FRAMEWORK_AUDIT_ENDED,
      auditLog.framework_id
    );
  }

  updateFrameworkWithExcludedPlugins(frameworkId: string, excludedPluginsListToUpdate: ExcludePlugin): void {
    this.store.dispatch(
      FrameworksAdapterActions.frameworkExcludedPluginsListUpdate({
        frameworkId,
        excludedPluginsListToUpdate,
      })
    );
  }

  includeAllPlugins(frameworkId: string): void {
    this.store.dispatch(
      FrameworksAdapterActions.frameworkExcludedPluginsListUpdate({
        frameworkId,
        excludedPluginsListToUpdate: {},
      })
    );
  }

  async includePluginAsync(frameworkId: string, service_id: string): Promise<void> {
    const framework = await this.getFrameworkById(frameworkId).pipe(take(1)).toPromise();
    const excludedPluginsListToUpdate = Object.fromEntries(Object.entries(framework.framework_excluded_plugins).filter(([entry, val]) => entry !== service_id));
    this.store.dispatch(
      FrameworksAdapterActions.frameworkExcludedPluginsListUpdate({
        frameworkId,
        excludedPluginsListToUpdate,
      })
    );
  }

  async excludePluginAsync(frameworkId: string, service_id: string): Promise<void> {
    const framework = await this.getFrameworkById(frameworkId).pipe(take(1)).toPromise();
    const excludedPluginsListToUpdate = Object.fromEntries([...Object.entries(framework.framework_excluded_plugins), [service_id, []]]);
    this.store.dispatch(
      FrameworksAdapterActions.frameworkExcludedPluginsListUpdate({
        frameworkId,
        excludedPluginsListToUpdate,
      })
    );
  }

  private async changeFrameworkApplicabilityAsync(frameworkId: string, type: 'abandon' | 'adopt'): Promise<void> {
    const framework = await this.getFrameworkById(frameworkId).pipe(take(1)).toPromise();

    // to prevent cases, for instance if we try to adopt already adopted framework
    if ((type === 'adopt' && !framework.is_applicable) || (type === 'abandon' && framework.is_applicable)) {
      this.store.dispatch(new FrameworkApplicabilityChangeAction(framework));

      // We should wait until applicability changes
      await this.getFrameworkById(frameworkId)
        .pipe(
          filter((f) => f.is_applicable === !framework.is_applicable),
          take(1)
        )
        .toPromise();
    }
  }

  private setAllFrameworksCache(): void {
    this.allFrameworksCache$ = this.store
      .select(FrameworkSelectors.SelectFrameworkState)
      .pipe(
        filter((frameworksState) => !!frameworksState.ids.length),
        map((frameworksState) => Object.values(frameworksState.entities)),
        map(
          (frameworks: Framework[]) =>
            frameworks.filter((framework) => framework.framework_id !== AnecdotesUnifiedFramework.framework_id) // remove AnecdotesUnifiedFramework
        ),
        map((frameworks) => frameworks.sort((f1, f2) => (f1.framework_status === FrameworkStatus.AVAILABLE ? -1 : 1))) // sort by availablity. Coming soon frameworks must go last
      );
  }
}
