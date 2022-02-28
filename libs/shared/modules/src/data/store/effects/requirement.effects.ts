import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { RequirementEventService } from 'core';
import { EvidenceCollectionTypeEnum } from 'core/modules/shared-controls/models/evidence-collection-modal-params';
import { EvidenceLike, isRequirement, ResourceType } from '../../models';
import { distinct, flattenAndDistinctArrays, removeItemFromList } from 'core/utils';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, repeat, take, tap, withLatestFrom } from 'rxjs/operators';
import {
  EvidenceService,
  OperationsTrackerService,
  RequirementService,
  SlackService,
  TrackOperations,
} from '../../services';
import {
  AddEvidenceFromTicketAction,
  AddRequirementAction,
  BatchControlsUpdateAction,
  ControlRequirementApplicabilityChangeAction,
  ControlRequirementBatchUpdatedAction,
  CreateEvidenceURLAction,
  DismissRequirementTaskSlackAction,
  EvidenceActionType,
  EvidenceAdapterActions,
  EvidenceLinkRemovedAction,
  EvidenceRemovedFromResourceAction,
  RemoveRequirementAction,
  RequirementIndexChangedAction,
  RequirementRemovedAction,
  RequirementsActionType,
  RequirementsAdapterActions,
  SendRequirementTaskSlackAction,
  UpdateControlAction,
} from '../actions';
import { RequirementsState } from '../reducers';
import {
  AttachRequirementPolicy,
  BatchUpdateRequirements,
  RemoveRequirementPolicy,
  RequirementAddedAction,
  RequirementBatchUpdated,
} from './../actions/requirements.actions';
import { ControlSelectors, RequirementSelectors } from '../selectors';
import { ControlRequirement, Requirement } from '../../models/domain';

const NO_ACTION = 'NO_ACTION';

@Injectable()
export class RequirementEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private evidenceHttpService: EvidenceService,
    private requirementHttpService: RequirementService,
    private operationsTrackerService: OperationsTrackerService,
    private slackService: SlackService,
    private requirementEventService: RequirementEventService
  ) {}

  @Effect()
  requirementStateChanged$ = this.store
    .select(RequirementSelectors.SelectRequirements)
    .pipe(
      filter(reqs => !!reqs),
      map((allRequirements) => {
        const policiesIndex = {};
        allRequirements.forEach((req) => {
          req.requirement_related_policies_ids?.forEach((policyId) => {
            if (!policiesIndex[policyId]) {
              policiesIndex[policyId] = [];
            }
            policiesIndex[policyId].push(req.requirement_id);
          });
        });
        return RequirementsAdapterActions.policyIndexChanged({ index: policiesIndex });
      }),
      repeat()
    );

  // this happens each time our controls are updated
  // it maps between requirements and controls so that updating a requirement would be faster
  @Effect()
  controlStateChanged$ = this.store
    .select(ControlSelectors.SelectControlsState)
    .pipe(
      map((controlsState) => controlsState.controls.entities),
      map((allControlsDictionary) => {
        const requirementsIndex = {};
        Object.values(allControlsDictionary).forEach((ctrl) => {
          ctrl.control_requirement_ids?.forEach((reqId) => {
            if (!requirementsIndex[reqId]) {
              requirementsIndex[reqId] = [];
            }
            requirementsIndex[reqId].push(ctrl.control_id);
          });
        });

        return new RequirementIndexChangedAction(requirementsIndex);
      }),
      repeat()
    );

  @Effect()
  removeRequirement$: Observable<Action> = this.actions$.pipe(
    ofType(RequirementsActionType.RemoveRequirement),
    mergeMap((action: RemoveRequirementAction) =>
      this.store.select(RequirementSelectors.SelectRequirementState).pipe(
        take(1),
        map((requirementState) => ({ requirementState, action }))
      )
    ),
    mergeMap((x) => {
      const requirementRelatedControls = x.requirementState.requirementControlsMapping[x.action.requirement_id];
      const isLastRequirement = requirementRelatedControls.length === 1;

      let call$: Observable<any>;

      if (isLastRequirement) {
        call$ = this.requirementHttpService.removeRequirement(x.action.requirement_id);
      } else {
        const newRequirementRelatedControls = requirementRelatedControls.filter(
          (reqId) => reqId !== x.action.control_id
        );
        call$ = this.requirementHttpService.patchRequirement(x.action.requirement_id, {
          requirement_related_controls: newRequirementRelatedControls,
        });
      }
      return call$.pipe(
        map(() => x.action),
        tap((action) => {
          this.operationsTrackerService.trackSuccess(action.requirement_id, TrackOperations.REQ_REMOVED);
        }),
        catchError((err) => {
          this.operationsTrackerService.trackError(
            x.action.requirement_id,
            new Error(err),
            TrackOperations.REQ_REMOVED
          );
          return EMPTY;
        })
      );
    }),
    map((x) => new RequirementRemovedAction(x.requirement_id, x.control_id))
  );

  @Effect()
  changeControlRequirementApplicability$: Observable<Action> = this.actions$.pipe(
    ofType(RequirementsActionType.ControlRequirementApplicabilityChange),
    mergeMap((action: ControlRequirementApplicabilityChangeAction) => {
      return this.requirementHttpService.changeControlRequirementApplicabilityState(action.requirement).pipe(
        withLatestFrom(this.store.select(RequirementSelectors.SelectRequirementState)),
        map((x) => {
          const response = x[0];
          const state = x[1];
          // we need to update only one control since it will trigger the update of requirements store.
          // this will trigger the update of all related controls.
          const controlId = state.requirementControlsMapping[action.requirement.requirement_id][0];
          this.store.dispatch(new UpdateControlAction(controlId));
          return new ControlRequirementBatchUpdatedAction([
            {
              requirement_id: action.requirement.requirement_id,
              requirement_applicability: response.true[0]?.is_applicable,
            },
          ]);
        }),
        tap(() => {
          this.operationsTrackerService.trackSuccess(
            action.requirement.requirement_id,
            TrackOperations.TOGGLE_REQ_APPLICABILITY
          );
        }),
        catchError(() => {
          this.operationsTrackerService.trackError(
            action.requirement.requirement_id,
            new Error(),
            TrackOperations.TOGGLE_REQ_APPLICABILITY
          );
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  sendControlRequirementSlackTask$: Observable<Action> = this.actions$.pipe(
    ofType(RequirementsActionType.SendRequirementTaskSlack),
    mergeMap((action: SendRequirementTaskSlackAction) => {
      return this.slackService.sendSlackMessage(action.message, action.messageReceivers, action.requirement_id).pipe(
        map(() => {
          return new ControlRequirementBatchUpdatedAction([
            {
              requirement_id: action.requirement_id,
              requirement_has_pending_slack_task: true,
            },
          ]);
        }),
        tap(() => this.operationsTrackerService.trackSuccess(action.requirement_id, TrackOperations.SEND_SLACK_TASK)),
        catchError(() => {
          this.operationsTrackerService.trackError(action.requirement_id, new Error(), TrackOperations.SEND_SLACK_TASK);
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  batchUpdate$: Observable<Action> = this.actions$.pipe(
    ofType(RequirementsActionType.BatchUpdateRequirement),
    mergeMap((action: BatchUpdateRequirements) => {
      return this.requirementHttpService.getRequirements(action.requirement_ids).pipe(
        map((res) => {
          return new RequirementBatchUpdated(action.requirement_ids, res);
        })
      );
    })
  );

  @Effect()
  dismissControlRequirementSlackTask$: Observable<Action> = this.actions$.pipe(
    ofType(RequirementsActionType.DismissRequirementTaskSlack),
    tap((action: DismissRequirementTaskSlackAction) => {
      // Force update without waiting for dismiss call response
      const updatedRequirement = { ...action.controlRequirement, requirement_has_pending_slack_task: false };
      this.store.dispatch(new ControlRequirementBatchUpdatedAction([updatedRequirement]));
    }),
    mergeMap((action: DismissRequirementTaskSlackAction) => {
      return this.slackService.dissmissSlackPendingState(action.controlRequirement.requirement_id).pipe(
        map(() => {
          return new ControlRequirementBatchUpdatedAction([
            {
              requirement_id: action.controlRequirement.requirement_id,
              requirement_has_pending_slack_task: false,
            },
          ]);
        }),
        tap(() =>
          this.operationsTrackerService.trackSuccess(
            action.controlRequirement.requirement_id,
            TrackOperations.SEND_SLACK_TASK
          )
        ),
        catchError(() => {
          const updatedRequirement = { ...action.controlRequirement, requirement_has_pending_slack_task: true };
          return of(new ControlRequirementBatchUpdatedAction([updatedRequirement]));
        })
      );
    })
  );

  @Effect()
  evidenceLinkRemoved$: Observable<Action> = this.actions$.pipe(
    ofType(EvidenceActionType.EvidenceLinkRemoved),
    mergeMap((action: EvidenceLinkRemovedAction) =>
      this.store
        .select(RequirementSelectors.SelectRequirementState)
        .pipe(
          take(1),
          map((state: RequirementsState) => {
            const requirement = state.controlRequirements.entities[action.payload.requirementId];
            if (!requirement) {
              return { type: NO_ACTION };
            }
            return new ControlRequirementBatchUpdatedAction([
              {
                requirement_id: requirement.requirement_id,
                requirement_evidence_ids: removeItemFromList(
                  requirement.requirement_evidence_ids,
                  action.payload.evidenceId
                ),
              },
            ]);
          })
        )
    )
  );

  @Effect()
  attachPolicy$: Observable<Action> = this.actions$.pipe(
    ofType(RequirementsActionType.AttachPolicyToRequirement),
    mergeMap((action: AttachRequirementPolicy) =>
      this.requirementHttpService.attachPolicyToRequirement(action.requirement.requirement_id, action.policyId).pipe(
        withLatestFrom(this.store.select(RequirementSelectors.SelectRequirementState).pipe(map((requirementState) => requirementState.requirementControlsMapping))),
        mergeMap(([_, reqControlsMapping]) => {
          if (!action.requirement) {
            return [{ type: NO_ACTION }];
          }
          return [
            new ControlRequirementBatchUpdatedAction([
              {
                requirement_id: action.requirement.requirement_id,
                requirement_related_policies_ids: [
                  ...action.requirement.requirement_related_policies_ids,
                  action.policyId,
                ],
              },
            ]),
            new BatchControlsUpdateAction(reqControlsMapping[action.requirement.requirement_id]),
          ];
        }),
        tap(() => {
          this.operationsTrackerService.trackSuccessWithData(
            TrackOperations.ATTACH_POLICY_TO_REQUIREMENT,
            action.requirement.requirement_id
          );
        }),
        catchError(() => {
          this.operationsTrackerService.trackError(TrackOperations.ATTACH_POLICY_TO_REQUIREMENT, new Error());
          return EMPTY;
        })
      )
    )
  );

  @Effect()
  removePolicyFromRequirement$: Observable<Action> = this.actions$.pipe(
    ofType(RequirementsActionType.RemovePolicyFromRequirement),
    mergeMap((action: RemoveRequirementPolicy) =>
      this.requirementHttpService.deletePolicyFromRequirement(action.requirement.requirement_id, action.policyId).pipe(
        withLatestFrom(
          this.store.select(RequirementSelectors.SelectRequirementState).pipe(map((requirementState) => requirementState.requirementControlsMapping[action.requirement.requirement_id]))
        ),
        map(([_, controlIds]) => {
          if (!action.requirement) {
            return { type: NO_ACTION };
          }
          controlIds?.forEach((controlId) => this.store.dispatch(new UpdateControlAction(controlId)));

          return new ControlRequirementBatchUpdatedAction([
            {
              requirement_id: action.requirement.requirement_id,
              requirement_related_policies_ids: removeItemFromList(
                action.requirement.requirement_related_policies_ids,
                action.policyId
              ),
            },
          ]);
        }),
        tap(() => {
          this.operationsTrackerService.trackSuccess(action.policyId, TrackOperations.DELETE_POLICY_FROM_REQUIREMENT);
        }),
        catchError(() => {
          this.operationsTrackerService.trackError(
            action.policyId,
            new Error(),
            TrackOperations.DELETE_POLICY_FROM_REQUIREMENT
          );
          return EMPTY;
        })
      )
    )
  );

  @Effect()
  evidenceRemovedFromResource$: Observable<Action> = this.actions$.pipe(
    ofType(EvidenceActionType.EvidenceRemovedFromResource),
    map((action: EvidenceRemovedFromResourceAction) => {
      {
        if (!action.resource || !isRequirement(action.resource)) {
          return { type: 'NO_ACTION' };
        }
        return new ControlRequirementBatchUpdatedAction([
          {
            requirement_id: action.resource.requirement_id,
            requirement_evidence_ids: removeItemFromList(action.resource.requirement_evidence_ids, action.evidenceId),
          },
        ]);
      }
    })
  );

  @Effect()
  addRequirement$ = this.actions$.pipe(
    ofType(RequirementsActionType.AddRequirement),
    mergeMap((action: AddRequirementAction) => {
      const { requirement_id, ...requirement } = action.payload.requirement;

      if (action.payload.isExistingRequirement) {
        return this.requirementHttpService.patchRequirement(requirement_id, action.payload.requirement);
      } else {
        return this.requirementHttpService.addRequirement(requirement);
      }
    }),
    mergeMap((req) =>
      this.requirementHttpService
        .getRequirement(req.requirement_id)
        .pipe(
          map((controlRequirement) => new RequirementAddedAction(controlRequirement, req.requirement_related_controls))
        )
    ),
    tap(() => {
      this.operationsTrackerService.trackSuccess(TrackOperations.ADD_REQUIREMENT);
    }),
    catchError(() => {
      this.operationsTrackerService.trackError(TrackOperations.ADD_REQUIREMENT, new Error());
      return EMPTY;
    }),
    repeat()
  );

  patchRequirement$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RequirementsAdapterActions.patchRequirement),
      mergeMap((action) => {
        return this.requirementHttpService.patchRequirement(action.requirement_id, action.requirement).pipe(
          tap(() => {
            this.operationsTrackerService.trackSuccess(action.requirement_id, TrackOperations.PATCH_REQUIREMENT);
          }),
          catchError((error) => {
            this.operationsTrackerService.trackError(
              action.requirement_id,
              new Error(),
              TrackOperations.PATCH_REQUIREMENT
            );
            return EMPTY;
          }),
          withLatestFrom(this.store.select(RequirementSelectors.SelectRequirementControlsMapping)),
          tap(([_, mapping]) => {
            this.store.dispatch(new BatchControlsUpdateAction(mapping[action.requirement_id]));
          }),
          map((_) => RequirementsAdapterActions.controlRequirementBatchUpdated({
            controlRequirementBatch: [
              this.convertReqToControlReq(action.requirement_id, action.requirement)
            ]
          })),
        );
      }),
      repeat()
    );
  });

  @Effect({ dispatch: false })
  createEvidenceURL$ = this.actions$.pipe(
    ofType(EvidenceActionType.CreateEvidenceURL),
    mergeMap((action: CreateEvidenceURLAction) =>
      this.requirementHttpService
        .createRequirementUrlEvidence(action.requirement_id, action.url, action.evidence_name)
        .pipe(
          tap((data) => this.operationsTrackerService.trackSuccessWithData(TrackOperations.CREATE_EVIDENCE_URL, data)),
          tap((_) => {
            this.store.dispatch(new BatchUpdateRequirements([action.requirement_id]));
          }),
          catchError((err) => {
            this.operationsTrackerService.trackError(TrackOperations.CREATE_EVIDENCE_URL, new Error(err));
            return EMPTY;
          })
        )
    )
  );

  @Effect({ dispatch: false })
  evidenceCreated$ = this.actions$.pipe(
    ofType(EvidenceAdapterActions.evidencesUploaded),
    filter((action) => action.targetResourceParams?.resourceType === ResourceType.Requirement),
    mergeMap((action) => {
      return this.store.select(RequirementSelectors.CreateRequirementSelector(action.targetResourceParams.resourceId)).pipe(
        tap((req) =>
          this.store.dispatch(
            RequirementsAdapterActions.patchRequirement({
              requirement_id: action.targetResourceParams.resourceId,
              requirement: {
                requirement_related_evidences: [...req.requirement_evidence_ids, ...action.evidences.map(({ id }) => id)],
              },
            })
          )
        ),
        take(1)
      );
    })
  );

  @Effect({ dispatch: false })
  addEvidenceSharedLink$ = this.actions$.pipe(
    ofType(EvidenceAdapterActions.evidencesUploaded),
    filter((action) => {
      const isRequirementResource = action.targetResourceParams?.resourceType === ResourceType.Requirement;
      const isSharedLinkType = action?.evidenceType === EvidenceCollectionTypeEnum.SHARED_LINK;

      return isRequirementResource && isSharedLinkType;
    }),
    tap((action) => {
      action.evidences.forEach((evidence: EvidenceLike) => {
        this.requirementEventService.trackAddEvidenceSharedLinkAsync(
          action.targetResourceParams.resourceId,
          action.frameworkId,
          action.controlId,
          evidence.service_display_name
        );
      });
    })
  );

  @Effect({ dispatch: false })
  addEvidenceFromDevice$ = this.actions$.pipe(
    ofType(EvidenceAdapterActions.evidencesUploaded),
    filter((action) => {
      const isRequirementResource = action.targetResourceParams?.resourceType === ResourceType.Requirement;
      const isFromDeviceType = action?.evidenceType === EvidenceCollectionTypeEnum.FROM_DEVICE;

      return isRequirementResource && isFromDeviceType;
    }),
    tap((action) => {
      action.evidences.forEach((evidence: EvidenceLike) => {
        this.requirementEventService.trackAddEvidenceFromDeviceAsync(
          action.targetResourceParams.resourceId,
          action.frameworkId,
          action.controlId,
          evidence.name
        );
      });
    })
  );

  @Effect({ dispatch: false })
  addEvidenceFromTicket$ = this.actions$.pipe(
    ofType(EvidenceActionType.AddEvidenceFromTicket),
    mergeMap((action: AddEvidenceFromTicketAction) =>
      this.requirementHttpService
        .createRequirementTicketingEvidence(
          action.requirement_id,
          action.service_id,
          action.service_instance_id,
          action.tickets
        )
        .pipe(
          tap((data) =>
            this.operationsTrackerService.trackSuccessWithData(TrackOperations.ADD_EVIDENCE_FROM_TICKET, data)
          ),
          tap((data) => {
            this.store.dispatch(new BatchUpdateRequirements([action.requirement_id]));
          }),
          catchError((err) => {
            this.operationsTrackerService.trackError(TrackOperations.ADD_EVIDENCE_FROM_TICKET, new Error(err));
            return EMPTY;
          })
        )
    )
  );

  private convertReqToControlReq(requirement_id: string, requirement: Requirement): ControlRequirement {
    const controlRequirement: ControlRequirement = { requirement_id };
    if (requirement.requirement_help) {
      controlRequirement['requirement_help'] = requirement.requirement_help;
    }
    if (requirement.requirement_description) {
      controlRequirement['requirement_name'] = requirement.requirement_description;
    }
    if (requirement.requirement_related_evidences) {
      controlRequirement['requirement_evidence_ids'] = requirement.requirement_related_evidences;
    }
    return controlRequirement;
  }
}
