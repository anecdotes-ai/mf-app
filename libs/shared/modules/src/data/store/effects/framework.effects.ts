import { Injectable } from '@angular/core';

import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, mergeMap, repeat, tap } from 'rxjs/operators';
import { AnecdotesUnifiedFramework } from '../../constants';
import { FrameworkService, OperationsTrackerService, TrackOperations } from '../../services';
import {
  FrameworkActionType,
  FrameworksAdapterActions,
  FrameworkApplicabilityChangeAction,
  FrameworkApplicabilityChangeFailAction,
  FrameworksAdoptedAction,
  FrameworksLoadedAction,
  LoadSpecificFrameworkAction,
  ReloadFrameworksAction,
  SpecificFrameworkLoadedAction,
  StartWithFrameworksAdoptionAction,
  BatchFrameworksUpdateAction,
  ReloadSnapshotStateAction,
  FrameworkUpdatedAction,
} from '../actions';
import { ReloadControlsAction } from './../actions/controls.actions';

@Injectable()
export class FrameworkEffects {
  constructor(
    private actions$: Actions,
    private frameworksHttpService: FrameworkService,
    private operationsTrackerService: OperationsTrackerService,
    private store: Store<any>
  ) {}

  @Effect()
  reloadFrameworks$: Observable<Action> = this.actions$.pipe(
    ofType(FrameworkActionType.ReloadFrameworks),
    mergeMap(() => this.loadFrameworks())
  );

  @Effect()
  loadSpecificFramework$: Observable<Action> = this.actions$.pipe(
    ofType(FrameworkActionType.LoadSpecificFramework),
    mergeMap((action: LoadSpecificFrameworkAction) =>
      this.frameworksHttpService
        .getSpecificFramework(action.frameworkId)
        .pipe(map((framework) => new SpecificFrameworkLoadedAction(framework)))
    )
  );

  @Effect()
  changeFrameworkApplicability$: Observable<Action> = this.actions$.pipe(
    ofType(FrameworkActionType.FrameworkApplicabilityChange),
    mergeMap((action: FrameworkApplicabilityChangeAction) => {
      return this.frameworksHttpService.changeApplicabilityState(action.framework).pipe(
        mergeMap(() => [new ReloadFrameworksAction(), new ReloadControlsAction()]),
        catchError((error) => of(new FrameworkApplicabilityChangeFailAction(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  frameworkExcludedPluginsListUpdate$: Observable<Action> = this.actions$.pipe(
    ofType(FrameworksAdapterActions.frameworkExcludedPluginsListUpdate),
    tap((action) => {
      this.store.dispatch(new FrameworkUpdatedAction({ framework_id: action.frameworkId, framework_excluded_plugins: action.excludedPluginsListToUpdate }));
    }),
    debounceTime(1000), // prevents frequent requests when exclusion gets changed too often
    mergeMap((action) => {
      return this.frameworksHttpService
        .updateFrameworksPluginsExclusionList(action.frameworkId, action.excludedPluginsListToUpdate);
    }),
    tap(() => this.store.dispatch(new ReloadControlsAction())),
    repeat()
  );

  @Effect()
  startWithFrameworksAdoption$: Observable<Action> = this.actions$.pipe(
    ofType(FrameworkActionType.StartWithFrameworksAdoption),
    mergeMap((action: StartWithFrameworksAdoptionAction) => {
      const calls = action.frameworks.map((framework) => this.frameworksHttpService.adoptFramework(framework));
      return forkJoin(calls).pipe(
        mergeMap(() => [new FrameworksAdoptedAction(action.frameworks), new ReloadControlsAction()]),
        tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.STARTED_WITH_FRAMEWORKS_ADOPTION)),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.STARTED_WITH_FRAMEWORKS_ADOPTION, error);
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  startWithAnecdotesEssentials$ = this.actions$.pipe(
    ofType(FrameworkActionType.StartWithAnecdotesEssentials),
    mergeMap(() => {
      return this.frameworksHttpService.adoptFramework(AnecdotesUnifiedFramework).pipe(
        map(() => new ReloadControlsAction()),
        tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.STARTED_WITH_ANECDOTES_ESSENTIALS)),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.STARTED_WITH_ANECDOTES_ESSENTIALS, error);
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  batchUpdate$ = this.actions$.pipe(
    ofType(BatchFrameworksUpdateAction),
    mergeMap((action) => {
      const calls = action.frameworks.map((framework) => this.frameworksHttpService.updateFreezeFramework(framework.framework_id, framework.freeze));
      return forkJoin(calls).pipe(
        mergeMap(() => [new FrameworksAdoptedAction(action.frameworks), new ReloadControlsAction(), ReloadSnapshotStateAction()]),
        tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.FRAMEWORKS_BATCH_UPDATE)),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.FRAMEWORKS_BATCH_UPDATE, error);
          return EMPTY;
        })
      );
    })
  );
  
  deleteFrameworkAudit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FrameworksAdapterActions.deleteFrameworkAudit),
      mergeMap((action) => {
        return this.frameworksHttpService.deleteFrameworkAudit(action.framework_id).pipe(
          tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.DELETE_FRAMEWORK_AUDIT, action.framework_id)),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.DELETE_FRAMEWORK_AUDIT, new Error(error), action.framework_id);
            return EMPTY;
          })
        );
      })
    );
  }, { dispatch: false })

  @Effect()
  getFrameworkAuditHistory$: Observable<Action> = this.actions$.pipe(
    ofType(FrameworksAdapterActions.getFrameworkAuditHistory),
    mergeMap(({ framework_id, only_completed }) => this.frameworksHttpService.getFrameworkAuditHistory(framework_id, only_completed).pipe(
      map((audit_logs) => FrameworksAdapterActions.frameworkAuditHistoryLoaded({ framework_id, audit_logs: audit_logs.reverse() }))
    )),
    tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.LOAD_AUDIT_HISTORY)),
    catchError((error) => {
      this.operationsTrackerService.trackError(TrackOperations.LOAD_AUDIT_HISTORY, error);
      return EMPTY;
    })
  );

  changeFrameworkAuditStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FrameworksAdapterActions.changeFrameworkAuditStatus),
      mergeMap(({ framework_id, status }) => {
        return this.frameworksHttpService.changeFrameworkAuditStatus(framework_id, status).pipe(
          tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.UPDATE_FRAMEWORK_AUDIT_STATUS, framework_id)),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.UPDATE_FRAMEWORK_AUDIT_STATUS, new Error(error), framework_id);
            return EMPTY;
          })
        );
      })
    );
  }, { dispatch: false })

  setFrameworkAudit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FrameworksAdapterActions.setFrameworkAudit),
      mergeMap(({ framework_id, audit }) => {
        return this.frameworksHttpService.setFrameworkAudit(framework_id, audit).pipe(
          tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.SET_FRAMEWORK_AUDIT, framework_id)),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.SET_FRAMEWORK_AUDIT, new Error(error), framework_id);
            return EMPTY;
          })
        );
      })
    );
  }, { dispatch: false })

  @Effect()
  updateFrameworkAudit$: Observable<Action> = this.actions$.pipe(
    ofType(FrameworksAdapterActions.updateFrameworkAudit),
    mergeMap(({ framework_id, audit }) => {
      return this.frameworksHttpService.updateFrameworkAudit(framework_id, audit).pipe(
        tap((_) => this.operationsTrackerService.trackSuccess(TrackOperations.UPDATE_FRAMEWORK_AUDIT, framework_id)),
        map((audit) => FrameworksAdapterActions.frameworkAuditUpdated({ audit })),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.UPDATE_FRAMEWORK_AUDIT, new Error(error), framework_id);
          return EMPTY;
        })
      );
    })
  );

  private loadFrameworks(): Observable<FrameworksLoadedAction> {
    return this.frameworksHttpService
      .getAllFrameworks()
      .pipe(map((frameworks) => new FrameworksLoadedAction([...frameworks, { ...AnecdotesUnifiedFramework }])));
  }
}
