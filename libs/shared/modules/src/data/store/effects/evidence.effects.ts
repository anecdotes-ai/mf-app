import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { EvidenceCollectionTypeEnum } from 'core/modules/shared-controls/models/evidence-collection-modal-params';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { EvidenceStatusEnum, EvidenceTypeEnum } from '../../models/domain';
import {
  DataAggregationFacadeService,
  EvidenceService,
  OperationsTrackerService,
  RequirementService,
} from '../../services';
import { TrackOperations } from '../../services/operations-tracker/constants/track.operations.list.constant';
import {
  AddEvidenceFromDeviceAction,
  AddEvidenceSharedLinkAction,
  AddEvidenceToResourceAction,
  BatchUpdateEvidence,
  EvidenceActionType,
  EvidenceAdapterActions,
  EvidenceAddedToResourceAction,
  EvidenceApplicabilityChangeAction,
  EvidenceBatchUpdatedAction,
  EvidenceCollectionAction,
  EvidenceLinkRemovedAction,
  EvidenceOfResourceUpdatedAction,
  EvidenceRemovedFromResourceAction,
  EvidenceUpdatedAction,
  RemoveEvidenceFromResourceAction,
  RemoveLinkAction,
  SetEvidenceStatusAction,
  SetEvidenceStatusPayload,
  UpdateControlAction,
  UpdateEvidenceOfResourceAction,
  UpdatePolicyAction,
} from '../actions';
import { CollectingEvidence, EvidenceLike, ResourceType } from '../../models';
import { EvidenceSelectors } from '../selectors/evidence.selectors';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { EvidenceCollectionMessages } from 'core/services/message-bus/constants/evidence-collection-messages.constants';
import { MANUAL } from './../../constants/evidence';
import { v4 as guidv4 } from 'uuid';

@Injectable()
export class EvidenceEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private evidenceHttpService: EvidenceService,
    private requirementHttpService: RequirementService,
    private operationsTrackerService: OperationsTrackerService,
    private dataAggregationFacadeService: DataAggregationFacadeService,
    private messageBusService: MessageBusService,
  ) {}

  @Effect()
  updateEvidence$: Observable<Action> = this.actions$.pipe(
    ofType(EvidenceActionType.BatchUpdateEvidence),
    mergeMap((action: BatchUpdateEvidence) => {
      return this.evidenceHttpService
        .getEvidences(action.evidenceIds)
        .pipe(map((evidences) => new EvidenceBatchUpdatedAction(evidences)));
    })
  );

  @Effect()
  changeEvidenceApplicability$: Observable<Action> = this.actions$.pipe(
    ofType(EvidenceActionType.EvidenceApplicabilityChange),
    mergeMap((action: EvidenceApplicabilityChangeAction) => {
      return this.evidenceHttpService.changeEvidenceApplicabilityState(action.evidence).pipe(
        map((response) => {
          return new EvidenceUpdatedAction({
            evidence_id: response.true[0]?.applicability_id,
            evidence_is_applicable: response.true[0]?.is_applicable,
          });
        }),
        tap(() =>
          this.operationsTrackerService.trackSuccess(TrackOperations.EVIDENCE_IGNORENCE, action.evidence.evidence_id)
        ),
        catchError(() => {
          this.operationsTrackerService.trackError(
            action.evidence.evidence_id,
            new Error(),
            TrackOperations.EVIDENCE_IGNORENCE
          );
          return EMPTY;
        })
      );
    })
  );

  @Effect({ dispatch: false })
  removeLink$: Observable<Action> = this.actions$.pipe(
    ofType(EvidenceActionType.RemoveLink),
    mergeMap((action: RemoveLinkAction) => {
      return this.requirementHttpService
        .deleteRequirementEvidence(action.payload.requirementId, action.payload.evidenceId)
        .pipe(
          map(() => {
            this.store.dispatch(new EvidenceLinkRemovedAction(action.payload));
            return EMPTY;
          }),
          tap(() =>
            this.operationsTrackerService.trackSuccess(action.payload.evidenceId, TrackOperations.EVIDENCE_REMOVE_LINK)
          ),
          catchError((err) => {
            this.operationsTrackerService.trackError(
              action.payload.evidenceId,
              new Error(err),
              TrackOperations.EVIDENCE_REMOVE_LINK
            );
            return EMPTY;
          })
        );
    }),
    switchMapTo(EMPTY) // not sure why we have this EMPTY here...
  );

  @Effect({ dispatch: false })
  setEvidenceStatus$: Observable<Action> = this.actions$.pipe(
    ofType(EvidenceActionType.SetEvidenceStatus),
    tap((action: SetEvidenceStatusAction) => {
      this.store.dispatch(this.updateEvidenceWithStatus(action.payload));
    }), // optimistic change - force update before call
    mergeMap((action: SetEvidenceStatusAction) => {
      return this.evidenceHttpService.setEvidenceStatus(action.payload.evidence, action.payload.newEvidenceStatus).pipe(
        catchError(() => {
          // in case of failure revert back
          action.payload.newEvidenceStatus =
            action.payload.newEvidenceStatus === EvidenceStatusEnum.NOTMITIGATED
              ? EvidenceStatusEnum.MITIGATED
              : EvidenceStatusEnum.NOTMITIGATED;
          this.store.dispatch(this.updateEvidenceWithStatus(action.payload));
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  addEvidenceToResource$: Observable<Action> = this.actions$.pipe(
    ofType(EvidenceActionType.AddEvidenceToResource),
    mergeMap((action: AddEvidenceToResourceAction) => {
      return this.evidenceHttpService.addEvidence(
        action.payload.resourceType,
        action.payload.resource_id,
        action.payload.service_id,
        action.payload.service_instance_id,
        action.payload.evidence,
        action.payload.link
      );
    }),
    map((evidence) => new EvidenceAddedToResourceAction(evidence)),
    tap(async (action: EvidenceAddedToResourceAction) => {
      await this.updaterelatedControls(action.payload.evidenceId);
    })
  );

  @Effect()
  updateEvidenceOfResource$: Observable<Action> = this.actions$.pipe(
    ofType(EvidenceActionType.UpdateEvidenceOfResource),
    mergeMap((action: UpdateEvidenceOfResourceAction) => {
      return this.evidenceHttpService.updateEvidence(
        action.payload.resourceType,
        action.payload.resource_id,
        action.payload.service_id,
        action.payload.service_instance_id,
        action.payload.evidence_id,
        action.payload.evidence,
        action.payload.link
      );
    }),
    map((evidence) => new EvidenceOfResourceUpdatedAction(evidence))
  );

  @Effect()
  DeleteEvidenceFromResource$: Observable<Action> = this.actions$.pipe(
    ofType(EvidenceActionType.RemovedEvidenceFromResource),
    mergeMap((action: RemoveEvidenceFromResourceAction) =>
      this.evidenceHttpService
        .deleteEvidence(action.payload.resourceType, action.payload.resourceId, action.payload.evidenceId)
        .pipe(
          map(() => new EvidenceRemovedFromResourceAction(action.payload.resource, action.payload.evidenceId)),
          tap(async () => {
            this.operationsTrackerService.trackSuccess(action.payload.evidenceId, TrackOperations.EVIDENCE_REMOVE_LINK);
            await this.updaterelatedControls(action.payload.evidenceId);
          }),
          catchError((err) => {
            this.operationsTrackerService.trackError(
              action.payload.evidenceId,
              new Error(err),
              TrackOperations.EVIDENCE_REMOVE_LINK
            );
            return EMPTY;
          })
        )
    )
  );

  @Effect()
  evidenceCollection$: Observable<Action> = this.actions$.pipe(
    ofType(EvidenceActionType.HandleCollection),
    mergeMap((action: EvidenceCollectionAction) => {
      const actionsList = [];
      const msgObject = action.collectionResult;
      const controlIds: Set<string> = new Set();

      if (!msgObject.collected_evidence_ids?.length) {
        return EMPTY;
      }

      actionsList.push(new BatchUpdateEvidence(msgObject.collected_evidence_ids));
      msgObject.collected_evidence_ids.forEach(async (evidenceId) => await this.updaterelatedControls(evidenceId));

      if (msgObject.policies_ids?.length) {
        msgObject.policies_ids.forEach(async (p) => {
          actionsList.push(new UpdatePolicyAction(p));
          const controls = await this.dataAggregationFacadeService
            .getPolicyRelatedControls(p)
            .pipe(take(1))
            .toPromise();
          controls.forEach((control) => {
            if (!controlIds.has(control.control_id)) {
              controlIds.add(control.control_id);
              this.store.dispatch(new UpdateControlAction(control.control_id));
            }
          });
        });
      }

      return actionsList;
    })
  );

  loadSpecificServiceInstance$ = createEffect(() => {
    return of(new Set<string>()).pipe(
      switchMap((requestedResourcesSet) => {
        return this.actions$.pipe(
          ofType(EvidenceAdapterActions.loadEvidenceHistoryRun),
          filter((action) => !requestedResourcesSet.has(action.evidence_id)),
          tap((action) => {
            requestedResourcesSet.add(action.evidence_id);
          }),
          mergeMap((action) =>
            this.evidenceHttpService.getEvidenceRunHistory(action.evidence_id, action.lastDate).pipe(
              map((resp) => {
                return EvidenceAdapterActions.evidenceHistoryRunLoaded({
                  evidence_id: action.evidence_id,
                  historyObj: resp,
                });
              }),
              tap((res) => {
                requestedResourcesSet.delete(action.evidence_id);
                this.operationsTrackerService.trackSuccessWithData(
                  action.evidence_id,
                  res,
                  TrackOperations.LOAD_EVIDENCE_HISTORY_RUN
                );
              }),
              catchError((err) => {
                requestedResourcesSet.delete(action.evidence_id);

                this.operationsTrackerService.trackError(
                  action.evidence_id,
                  new Error(err),
                  TrackOperations.LOAD_EVIDENCE_HISTORY_RUN
                );
                return EMPTY;
              })
            )
          )
        );
      })
    );
  });

  @Effect({ dispatch: false })
  addEvidenceSharedLink$ = this.actions$.pipe(
    ofType(EvidenceActionType.AddEvidenceSharedLink),
    filter((action: AddEvidenceSharedLinkAction) => action.resourceType !== ResourceType.Policy), // Temporary until we solve issue with policy
    mergeMap((action: AddEvidenceSharedLinkAction) => {
      return this.evidenceHttpService
        .createSharedLinkEvidence(
          action.service_id,
          action.service_instance_id,
          action.link
        )
        .pipe(
          tap((data) => {
            const collectingEvidences: CollectingEvidence[] = data.evidence_id.map((evidenceId) => ({
              evidenceId,
              serviceId: action.service_id,
              evidenceType: EvidenceTypeEnum.LINK,
              serviceDisplayName: action.service_id,
            }));

            this.messageBusService.sendMessage<CollectingEvidence[]>(
              EvidenceCollectionMessages.COLLECTION_STARTED,
              collectingEvidences,
              action.resource_id
            );
            this.operationsTrackerService.trackSuccessWithData(TrackOperations.ADD_EVIDENCE_SHARED_LINK, data);
          }),
          catchError((err) => {
            this.operationsTrackerService.trackError(TrackOperations.ADD_EVIDENCE_SHARED_LINK, err);
            return EMPTY;
          }),
          mergeMap((data) => {
            return this.getEvidenceInStore(data.evidence_id).pipe(
              tap((evidences: EvidenceLike[]) => {
                const payload = {
                  evidences,
                  targetResourceParams: { resourceId: action.resource_id, resourceType: action.resourceType },
                  evidenceType: EvidenceCollectionTypeEnum.SHARED_LINK,
                  ...(action.frameworkId && { frameworkId: action.frameworkId }),
                  ...(action.controlId && { controlId: action.controlId }),
                };

                this.store.dispatch(
                  EvidenceAdapterActions.evidencesUploaded(payload)
                );
              })
            );
          })
        );
    })
  );

  @Effect({ dispatch: false })
  addEvidenceFromDevice$ = this.actions$.pipe(
    ofType(EvidenceActionType.AddEvidenceFromDevice),
    filter((action: AddEvidenceFromDeviceAction) => action.payload.resourceType !== ResourceType.Policy), // Temporary until we solve issue with policy
    mergeMap((action: AddEvidenceFromDeviceAction) => {
      const collectingEvidence: CollectingEvidence = {
        temporaryId: guidv4(),
        evidenceType: EvidenceTypeEnum.MANUAL,
        serviceId: MANUAL,
      };

      this.messageBusService.sendMessage<CollectingEvidence[]>(
        EvidenceCollectionMessages.COLLECTION_STARTED,
        [collectingEvidence],
        action.payload.resource_id
      );

      return this.evidenceHttpService
        .uploadEvidence(
          action.payload.service_id,
          action.payload.service_id === MANUAL ? null : action.payload.service_instance_id,
          action.payload.evidence
        )
        .pipe(
          mergeMap((data) => {
            return this.getEvidenceInStore(data.evidence_id).pipe(
              tap((evidences: EvidenceLike[]) => {
                const payload = {
                  evidences,
                  targetResourceParams: {
                    resourceId: action.payload.resource_id,
                    resourceType: action.payload.resourceType,
                  },
                  evidenceType: EvidenceCollectionTypeEnum.FROM_DEVICE,
                  ...(action.payload.frameworkId && { frameworkId: action.payload.frameworkId }),
                  ...(action.payload.controlId && { controlId: action.payload.controlId }),
                };

                this.store.dispatch(EvidenceAdapterActions.evidencesUploaded(payload));
              })
            );
          }),
          tap((data) => {
            this.operationsTrackerService.trackSuccessWithData(TrackOperations.ADD_EVIDENCE_FROM_DEVICE, data);
            this.messageBusService.sendMessage<CollectingEvidence[]>(
              EvidenceCollectionMessages.EVIDENCE_UPLOADED,
              [collectingEvidence],
              action.payload.resource_id
            );
          }),
          catchError((err) => {
            this.operationsTrackerService.trackError(
              TrackOperations.ADD_EVIDENCE_FROM_DEVICE,
              new Error(JSON.stringify(err))
            );
            return EMPTY;
          })
        );
    })
  );

  /** @deprecated TODO: It must be removed when policy start having endpoint for linking evidence */
  @Effect({ dispatch: false })
  addEvidenceSharedLinkForPolicy$ = this.actions$.pipe(
    ofType(EvidenceActionType.AddEvidenceSharedLink),
    filter((action: AddEvidenceSharedLinkAction) => action.resourceType === ResourceType.Policy),
    mergeMap((action: AddEvidenceSharedLinkAction) => {
      return this.evidenceHttpService
        .addEvidence(
          action.resourceType,
          action.resource_id,
          action.service_id,
          action.service_instance_id,
          action.evidence,
          action.link
        )
        .pipe(
          tap(({ evidence_id }) => {
            const collectingEvidences: CollectingEvidence[] = evidence_id.map((evidenceId) => ({
              evidenceId,
              serviceId: action.service_id,
              evidenceType: EvidenceTypeEnum.LINK,
              serviceDisplayName: action.service_id,
            }));

            this.messageBusService.sendMessage<CollectingEvidence[]>(
              EvidenceCollectionMessages.COLLECTION_STARTED,
              collectingEvidences,
              action.resource_id
            );

            this.operationsTrackerService.trackSuccessWithData(TrackOperations.ADD_EVIDENCE_SHARED_LINK, { evidence_id });
          }),
          catchError((err) => {
            this.operationsTrackerService.trackError(TrackOperations.ADD_EVIDENCE_SHARED_LINK, err);
            return EMPTY;
          }),
          mergeMap(({ evidence_id }) => {
            return this.getEvidenceInStore(evidence_id).pipe(
              tap((evidences: EvidenceLike[]) => {
                this.store.dispatch(
                  EvidenceAdapterActions.evidencesUploaded({
                    evidences,
                    targetResourceParams: { resourceId: action.resource_id, resourceType: action.resourceType },
                    evidenceType: EvidenceCollectionTypeEnum.SHARED_LINK,
                  })
                );
              }),
            );
          })
        );
    })
  );

  /** @deprecated TODO: It must be removed when policy start having endpoint for linking evidence */
  @Effect({ dispatch: false })
  addEvidenceFromDeviceForPolicy$ = this.actions$.pipe(
    ofType(EvidenceActionType.AddEvidenceFromDevice),
    filter((action: AddEvidenceFromDeviceAction) => action.payload.resourceType === ResourceType.Policy),
    mergeMap((action: AddEvidenceFromDeviceAction) => {
      const collectingEvidence: CollectingEvidence = {
        temporaryId: guidv4(),
        evidenceType: EvidenceTypeEnum.MANUAL,
        serviceId: MANUAL,
      };

      this.messageBusService.sendMessage<CollectingEvidence[]>(
        EvidenceCollectionMessages.COLLECTION_STARTED,
        [collectingEvidence],
        action.payload.resource_id
      );

      return this.evidenceHttpService
        .addEvidence(
          action.payload.resourceType,
          action.payload.resource_id,
          action.payload.service_id,
          action.payload.service_id === MANUAL ? null : action.payload.service_instance_id,
          action.payload.evidence,
          action.payload.link
        )
        .pipe(
          mergeMap(({ evidence_id }) => {
            return this.getEvidenceInStore(evidence_id).pipe(
              tap((evidences: EvidenceLike[]) => {
                this.store.dispatch(
                  EvidenceAdapterActions.evidencesUploaded({
                    evidences,
                    targetResourceParams: {
                      resourceId: action.payload.resource_id,
                      resourceType: action.payload.resourceType,
                    },
                    evidenceType: EvidenceCollectionTypeEnum.FROM_DEVICE,
                  })
                );
              })
            );
          }),
          tap((data) => {
            this.operationsTrackerService.trackSuccessWithData(TrackOperations.ADD_EVIDENCE_FROM_DEVICE, data);
            this.messageBusService.sendMessage<CollectingEvidence[]>(
              EvidenceCollectionMessages.EVIDENCE_UPLOADED,
              [collectingEvidence],
              action.payload.resource_id
            );
          }),
          catchError((err) => {
            this.operationsTrackerService.trackError(
              TrackOperations.ADD_EVIDENCE_FROM_DEVICE,
              new Error(JSON.stringify(err))
            );
            return EMPTY;
          })
        );
    })
  );

  private getEvidenceInStore(evidenceIds: string[]): Observable<EvidenceLike[]> {
    const evidenceIdSet = new Set(evidenceIds);

    return this.store.select(EvidenceSelectors.CreateEvidenceLikesSelectorByIds(evidenceIds)).pipe(
      filter((evidences) => evidences.some((e) => evidenceIdSet.has(e.id))),
      take(1)
    );
  }

  private updateEvidenceWithStatus(data: SetEvidenceStatusPayload): EvidenceUpdatedAction {
    return new EvidenceUpdatedAction({
      evidence_id: data.evidence.evidence_id,
      evidence_status: data.newEvidenceStatus,
    });
  }

  private async updaterelatedControls(evidenceId: string): Promise<void> {
    const controlIds: Set<string> = new Set();
    const controls = await this.dataAggregationFacadeService
      .getEvidenceRelatedControls(evidenceId)
      .pipe(take(1))
      .toPromise();

    controls.forEach((control) => {
      if (!controlIds.has(control.control_id)) {
        controlIds.add(control.control_id);
        this.store.dispatch(new UpdateControlAction(control.control_id));
      }
    });
  }
}
