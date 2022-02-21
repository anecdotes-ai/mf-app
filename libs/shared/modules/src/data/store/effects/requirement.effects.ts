import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { RequirementEventService } from 'core';
import { EvidenceCollectionTypeEnum } from 'core/modules/shared-controls/models/evidence-collection-modal-params';
import { EvidenceLike, isRequirement, ResourceType } from '../../models';
import { removeItemFromList } from 'core/utils';
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
import { State } from '../index';
import { RequirementsState } from '../reducers';
import {
  AttachRequirementPolicy,
  BatchUpdateRequirements,
  EditRequirementAction,
  RemoveRequirementPolicy,
  RequirementAddedAction,
  RequirementBatchUpdated,
} from './../actions/requirements.actions';
import { createRequirementSelector } from '../selectors';

const NO_ACTION = 'NO_ACTION';

@Injectable()
export class RequirementEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private evidenceHttpService: EvidenceService,
    private requirementHttpService: RequirementService,
    private operationsTrackerService: OperationsTrackerService,
    private slackService: SlackService,
    private requirementEventService: RequirementEventService,
  ) {}

  @Effect()
  requirementStateChanged$ = this.store
    .select((x) => x.requirementState.controlRequirements.entities)
    .pipe(
      map((allReqsDictionary) => {
        const policiesIndex = {};
        Object.values(allReqsDictionary).forEach((req) => {
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
    .select((x) => x.controlsState.controls.entities)
    .pipe(
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
      this.store.pipe(
        take(1),
        map((state) => ({ state, action }))
      )
    ),
    mergeMap((x) => {
      const requirementRelatedControls = x.state.requirementState.requirementControlsMapping[x.action.requirement_id];
      const isLastRequirement = requirementRelatedControls.length === 1;

      let call$: Observable<any>;

      if (isLastRequirement) {
        call$ = this.requirementHttpService.removeRequirement(x.action.requirement_id);
      } else {
        const newRequirementRelatedControls = requirementRelatedControls.filter(
          (reqId) => reqId !== x.action.control_id
        );
        call$ = this.requirementHttpService.editRequirement(x.action.requirement_id, {
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
        withLatestFrom(this.store.select((state) => state.requirementState)),
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
        .select((state) => state.requirementState)
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
        withLatestFrom(this.store.select((state) => state.requirementState.requirementControlsMapping)),
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
        withLatestFrom(this.store.select(s => s.requirementState.requirementControlsMapping[action.requirement.requirement_id])),
        map(([_, controlIds]) => {
          if (!action.requirement) {
            return { type: NO_ACTION };
          }
          controlIds?.forEach(controlId => this.store.dispatch(new UpdateControlAction(controlId)));

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
        return this.requirementHttpService.editRequirement(requirement_id, requirement);
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

  @Effect()
  editRequirement$ = this.actions$.pipe(
    ofType(RequirementsActionType.EditRequirement),
    withLatestFrom(this.store.select((s) => s.requirementState.requirementControlsMapping)),
    mergeMap(([action, requirementControlsMapping]) => {
      const editRequirementAction = action as EditRequirementAction;
      const { requirement_id, ...requirement } = editRequirementAction.updatedRequirement;
      return this.requirementHttpService
        .editRequirement(requirement_id, {
          requirement_help: requirement.requirement_help,
          requirement_description: requirement.requirement_name,
          requirement_related_controls:
            requirementControlsMapping[editRequirementAction.updatedRequirement.requirement_id],
          requirement_related_evidences: [...requirement.requirement_evidence_ids],
        })
        .pipe(map((res) => ({ res, actionRequirement: editRequirementAction.updatedRequirement })));
    }),
    map(({ res, actionRequirement }) => new ControlRequirementBatchUpdatedAction([actionRequirement])),
    tap(() => {
      this.operationsTrackerService.trackSuccess(TrackOperations.EDIT_REQUIREMENT);
    }),
    catchError((error) => {
      this.operationsTrackerService.trackError(TrackOperations.EDIT_REQUIREMENT, new Error());
      return EMPTY;
    }),
    repeat()
  );

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
      return this.store.select(createRequirementSelector(action.targetResourceParams.resourceId), take(1)).pipe(
        tap((req) => this.store.dispatch(new EditRequirementAction({ requirement_id: action.targetResourceParams.resourceId, requirement_evidence_ids: [...req.requirement_evidence_ids, ...action.evidences.map(({ id }) => id)] } )))
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
          evidence.service_display_name,
        );
      });
    }),
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
          evidence.name,
        );
      });
    }),
  );

  @Effect({ dispatch: false })
  addEvidenceFromTicket$ = this.actions$.pipe(
    ofType(EvidenceActionType.AddEvidenceFromTicket),
    mergeMap((action: AddEvidenceFromTicketAction) =>
      this.requirementHttpService
        .createRequirementTicketingEvidence(action.requirement_id, action.service_id, action.service_instance_id, action.tickets)
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
}
