import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { EvidenceLike } from 'core/modules/data/models';
import { EvidenceCollectionTypeEnum } from 'core/modules/shared-controls/models/evidence-collection-modal-params';
import { EMPTY, forkJoin, NEVER, Observable, of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
import { RiskFacadeService, RiskService } from '../../services';
import { RisksActions } from '../actions/risks.actions';
import { RiskSelectors } from '../selectors';
import { EvidenceAdapterActions } from 'core/modules/data/store';
import { Risk } from '../../models';
import { RiskResourceType } from '../../constants';

@Injectable()
export class RiskEffects {
  constructor(
    private actions$: Actions,
    private riskService: RiskService,
    private operationsTrackerService: OperationsTrackerService,
    private store: Store,
    private riskFacadeService: RiskFacadeService,
  ) {}

  loadData$ = createEffect(() => {
    return of({ isInProcess: false }).pipe(
      switchMap((obj) => {
        if (obj.isInProcess) {
          return NEVER;
        }

        return this.actions$.pipe(
          ofType(RisksActions.InitRisksState),
          mergeMap((action) => {
            obj.isInProcess = true;
            return forkJoin([
              this.riskService.getAllRisks(),
              this.riskService.getAllRiskCategories(),
              this.riskService.getAllRiskSources(),
            ]).pipe(
              tap(() => {
                obj.isInProcess = false;
                this.operationsTrackerService.trackSuccess(action.type);
              }),
              catchError((err) => {
                this.operationsTrackerService.trackError(action.type, err);
                obj.isInProcess = false;
                return NEVER;
              })
            );
          })
        );
      }),
      mergeMap(([risks, risk_categories, risk_sources]) => {
        return [
          RisksActions.RisksLoaded({ risks }),
          RisksActions.RiskCategoriesLoaded({ risk_categories }),
          RisksActions.RiskSourcesLoaded({ risk_sources }),
        ];
      })
    );
  });

  addRisk$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(RisksActions.AddRisk),
      mergeMap((action) => {
        return this.riskService.addRisk(action.risk).pipe(map((risk) => RisksActions.RiskAdded({ risk })));
      }),
      tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.ADD_RISK)),
      catchError((error) => {
        this.operationsTrackerService.trackError(TrackOperations.ADD_RISK, error);
        return EMPTY;
      })
    );
  });

  getRisk$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(RisksActions.GetRisk),
      mergeMap((action) =>
        this.riskService.getRiskById(action.risk_id).pipe(map((risk) => RisksActions.RiskLoaded({ risk })))
      )
    );
  });

  editRisk$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(RisksActions.EditRisk),
      mergeMap(({ risk }) => {
        return this.riskService.editRisk(risk).pipe(
          map((risk) => RisksActions.RiskEdited({ risk })),
          tap(({ risk }) => {
            return this.operationsTrackerService.trackSuccessWithData(TrackOperations.EDIT_RISK, risk, risk.id);
          }),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.EDIT_RISK, error, risk.id);
            return EMPTY;
          })
        );
      })
    );
  });

  evidenceCreated$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EvidenceAdapterActions.evidencesUploaded),
      filter((action) => action.targetResourceParams?.resourceType === RiskResourceType),
      mergeMap(action => {
        return this.getRisk(action.targetResourceParams.resourceId).pipe(mergeMap((risk) => {
          const updatedRisk = {...risk, evidence_ids: [...risk.evidence_ids, ...action.evidences.map(({ id }) => id)] };
          this.store.dispatch(RisksActions.RiskEdited({ risk: updatedRisk }));
          return this.riskService.updateEvidences(action.targetResourceParams.resourceId, updatedRisk.evidence_ids).pipe(mapTo(updatedRisk));
        }));
      }),
    );
  }, { dispatch: false });

  addSupportingDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EvidenceAdapterActions.evidencesUploaded),
      filter((action) => {
        const isRiskResource = action.targetResourceParams?.resourceType === RiskResourceType;
        const isFromDeviceType = action?.evidenceType === EvidenceCollectionTypeEnum.FROM_DEVICE;
        const isSharedLinkType = action?.evidenceType === EvidenceCollectionTypeEnum.SHARED_LINK;

        return isRiskResource && (isFromDeviceType || isSharedLinkType);
      }),
      tap((action) => {
        action.evidences.forEach((evidence: EvidenceLike) => {
          this.riskFacadeService.addSupportingDocumentEvent(evidence, action.evidenceType, action.targetResourceParams.resourceId);
        });
      }),
    );
  }, { dispatch: false });

  removeEvidence$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RisksActions.RemoveEvidenceFromRisk),
      mergeMap((action) => {
        return this.getRisk(action.riskId).pipe(
          mergeMap((risk) => {
            const updatedRisk = {...risk, evidence_ids: risk.evidence_ids.filter((evidenceId) => evidenceId !== action.evidenceId) };
            this.store.dispatch(RisksActions.RiskEdited({ risk: updatedRisk }));
            return this.riskService.updateEvidences(action.riskId, updatedRisk.evidence_ids).pipe(mapTo(updatedRisk));
          })
        );
      })
    );
  }, { dispatch: false });

  deleteRisk$: Observable<Action> = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(RisksActions.DeleteRisk),
        tap(({ risk_id }) => this.store.dispatch(RisksActions.RiskDeleted({ risk_id }))),
        mergeMap(({ risk_id }) => this.riskService.deleteRisk(risk_id)),
        tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.DELETE_RISK)),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.DELETE_RISK, error);
          return EMPTY;
        })
      );
    },
    { dispatch: false }
  );

  loadRiskCategories$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(RisksActions.InitRiskCategoriesState),
      mergeMap(() =>
        this.riskService
          .getAllRiskCategories()
          .pipe(map((risk_categories) => RisksActions.RiskCategoriesLoaded({ risk_categories })))
      )
    );
  });

  addRiskCategory$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(RisksActions.AddRiskCategory),
      mergeMap((action) => {
        return this.riskService.addRiskCategory(action.risk_category).pipe(
          map((risk_category) => RisksActions.RiskCategoryAdded({ risk_category })),
          tap(({ risk_category }) =>
            this.operationsTrackerService.trackSuccessWithData(TrackOperations.ADD_RISK_CATEGORY, risk_category)
          ),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.ADD_RISK_CATEGORY, error);
            return EMPTY;
          })
        );
      })
    );
  });

  getRiskCategory$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(RisksActions.GetRiskCategory),
      mergeMap((action) =>
        this.riskService
          .getRiskCategoryById(action.risk_category_id)
          .pipe(map((risk_category) => RisksActions.RiskCategoryLoaded({ risk_category })))
      )
    );
  });

  deleteRiskCategory$: Observable<Action> = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(RisksActions.DeleteRiskCategory),
        tap(({ risk_category_id }) => RisksActions.RiskCategoryDeleted({ risk_category_id })),
        mergeMap(({ risk_category_id }) => this.riskService.deleteRiskCategory(risk_category_id)),
        tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.DELETE_RISK_CATEGORY)),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.DELETE_RISK_CATEGORY, error);
          return EMPTY;
        })
      );
    },
    { dispatch: false }
  );

  loadRiskSources$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(RisksActions.InitRiskSourcesState),
      mergeMap(() =>
        this.riskService
          .getAllRiskSources()
          .pipe(map((risk_sources) => RisksActions.RiskSourcesLoaded({ risk_sources })))
      )
    );
  });

  addRiskSource$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(RisksActions.AddRiskSource),
      mergeMap((action) => {
        return this.riskService.addRiskSource(action.risk_source).pipe(
          map((risk_source) => RisksActions.RiskSourceAdded({ risk_source })),
          tap(({ risk_source }) =>
            this.operationsTrackerService.trackSuccessWithData(TrackOperations.ADD_RISK_SOURCE, risk_source)
          ),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.ADD_RISK_SOURCE, error);
            return EMPTY;
          })
        );
      })
    );
  });

  getRiskSource$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(RisksActions.GetRiskSource),
      mergeMap((action) =>
        this.riskService
          .getRiskSourceById(action.risk_source_id)
          .pipe(map((risk_source) => RisksActions.RiskSourceLoaded({ risk_source })))
      )
    );
  });

  deleteRiskSource$: Observable<Action> = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(RisksActions.DeleteRiskSource),
        tap(({ risk_source_id }) => RisksActions.RiskSourceDeleted({ risk_source_id })),
        mergeMap(({ risk_source_id }) => this.riskService.deleteRiskSource(risk_source_id)),
        tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.DELETE_RISK_SOURCE)),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.DELETE_RISK_SOURCE, error);
          return EMPTY;
        })
      );
    },
    { dispatch: false }
  );

  private getRisk(riskId: string): Observable<Risk> {
    return this.store.select(RiskSelectors.createByIdSelector(riskId)).pipe(take(1));
  }
}
