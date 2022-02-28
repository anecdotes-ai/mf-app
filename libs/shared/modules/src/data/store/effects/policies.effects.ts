import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { EvidenceCollectionTypeEnum } from 'core/modules/shared-controls/models/evidence-collection-modal-params';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { EvidenceLike, ResourceType } from '../../models';
import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { isPolicy } from '../../models/domain';
import { DataAggregationFacadeService, OperationsTrackerService, PolicyService, TrackOperations } from '../../services';
import { EditApproveOnBehalfAction, EditPolicySettingsAction, UpdateControlAction } from '../actions';
import {
  EvidenceActionType,
  EvidenceAdapterActions,
  EvidenceRemovedFromResourceAction,
  EvidencesLoadedAction,
} from '../actions/evidences.actions';
import {
  AddCustomPolicyAction,
  BatchPolicyUpdatedAction,
  CustomPolicyAddedAction,
  CustomPolicyRemovedAction,
  EditCustomPolicyAction,
  PolicyActionType,
  PolicySharedAction,
  PolicyUpdatedAction,
  RemoveCustomPolicyAction,
  SharePolicyAction,
  UpdatePolicyAction,
} from '../actions/policies.actions';

@Injectable()
export class PoliciesEffects {
  constructor(
    private actions$: Actions,
    private policiesHttpService: PolicyService,
    private store: Store,
    private operationsTrackerService: OperationsTrackerService,
    private aggregationService: DataAggregationFacadeService,
    private policyManagerEventService: PolicyManagerEventService,
  ) {}

  @Effect()
  addPolicy$: Observable<Action> = this.actions$.pipe(
    ofType(PolicyActionType.AddCustomPolicy),
    mergeMap((action: AddCustomPolicyAction) => {
      return this.policiesHttpService.addPolicy(action.modalData).pipe(
        tap((policy) => {
          this.operationsTrackerService.trackSuccessWithData(TrackOperations.ADD_CUSTOM_POLICY, policy.policy_id);
        }),
        catchError(() => {
          this.operationsTrackerService.trackError(TrackOperations.ADD_CUSTOM_POLICY, new Error());
          return EMPTY;
        })
      );
    }),
    map((policy) => new CustomPolicyAddedAction(policy))
  );

  @Effect()
  editPolicy$: Observable<Action> = this.actions$.pipe(
    ofType(PolicyActionType.EditCustomPolicy),
    mergeMap((action: EditCustomPolicyAction) => {
      return this.policiesHttpService.editPolicy(action.policyId, action.modalData).pipe(
        tap(() => {
          this.operationsTrackerService.trackSuccessWithData(
            action.policyId,
            action.policyId,
            TrackOperations.UPDATE_CUSTOM_POLICY
          );
        }),
        catchError(() => {
          this.operationsTrackerService.trackError(action.policyId, new Error(), TrackOperations.UPDATE_CUSTOM_POLICY);
          return EMPTY;
        })
      );
    }),
    map((policy) => {
      return new PolicyUpdatedAction(policy.policy_id, policy);
    })
  );

  @Effect({ dispatch: false })
  addEvidenceSharedLink$ = this.actions$.pipe(
    ofType(EvidenceAdapterActions.evidencesUploaded),
    filter((action) => {
      const isPolicyResource = action.targetResourceParams?.resourceType === ResourceType.Policy;
      const isSharedLinkType = action?.evidenceType === EvidenceCollectionTypeEnum.SHARED_LINK;

      return isPolicyResource && isSharedLinkType;
    }),
    // TODO: Make request for linking created evidence with policy
    tap((action) => this.store.dispatch(new UpdatePolicyAction(action.targetResourceParams.resourceId))),
    tap((action) => {
      action.evidences.forEach((evidence: EvidenceLike) => {
        this.policyManagerEventService.trackLinkPolicyEvent(action.targetResourceParams.resourceId, evidence.service_display_name);
      });
    }),
  );

  @Effect({ dispatch: false })
  addEvidenceUploadFile$ = this.actions$.pipe(
    ofType(EvidenceAdapterActions.evidencesUploaded),
    filter((action) => {
      const isPolicyResource = action.targetResourceParams?.resourceType === ResourceType.Policy;
      const isFromDeviceType = action?.evidenceType === EvidenceCollectionTypeEnum.FROM_DEVICE;

      return isPolicyResource && isFromDeviceType;
    }),
    // TODO: Make request for linking created evidence with policy
    tap((action) => this.store.dispatch(new UpdatePolicyAction(action.targetResourceParams.resourceId))),
    tap((action) => {
      action.evidences.forEach((evidence: EvidenceLike) => {
        this.policyManagerEventService.trackUploadPolicyFileEvent(action.targetResourceParams.resourceId, evidence.name);
      });
    }),
  );

  @Effect()
  removePolicy$: Observable<Action> = this.actions$.pipe(
    ofType(PolicyActionType.RemoveCustomPolicy),
    mergeMap((action: RemoveCustomPolicyAction) => {
      return this.policiesHttpService.deletePolicy(action.policy.policy_id).pipe(
        withLatestFrom(this.aggregationService.getPolicyRelatedControls(action.policy.policy_id)),
        map(([_, relatedControls]) => {
          relatedControls?.forEach(c => this.store.dispatch(new UpdateControlAction(c.control_id)));
          return action.policy.policy_group === null
            ? new CustomPolicyRemovedAction(action.policy.policy_id)
            : new UpdatePolicyAction(action.policy.policy_id);
        }),
        tap((policy) => {
          this.operationsTrackerService.trackSuccess(policy.policyId, TrackOperations.DELETE_CUSTOM_POLICY);
        }),
        catchError((policy) => {
          this.operationsTrackerService.trackError(policy.policyId, new Error(), TrackOperations.DELETE_CUSTOM_POLICY);
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  updatePolicies$: Observable<Action> = this.actions$.pipe(
    ofType(PolicyActionType.UpdatePolicy),
    mergeMap((action: UpdatePolicyAction) => this.policiesHttpService.getPolicy(action.policyId)),
    tap((policy) => {
      if (policy.evidence) {
        this.store.dispatch(new EvidencesLoadedAction([policy.evidence]));
      }
    }),
    map((policy) => new BatchPolicyUpdatedAction([policy]))
  );

  @Effect()
  evidenceRemovedFromResource$: Observable<Action> = this.actions$.pipe(
    ofType(EvidenceActionType.EvidenceRemovedFromResource),
    map((action: EvidenceRemovedFromResourceAction) => {
      if (!action.resource || !isPolicy(action.resource)) {
        return { type: 'NO_ACTION' };
      }
      return new BatchPolicyUpdatedAction([
        {
          policy_id: action.resource.policy_id,
          policy_related_evidence: undefined,
          evidence: undefined,
        },
      ]);
    })
  );

  @Effect()
  editPolicySettings$: Observable<Action> = this.actions$.pipe(
    ofType(PolicyActionType.EditPolicySettings),
    mergeMap((action: EditPolicySettingsAction) => {
      return this.policiesHttpService.editPolicySettings(action.policyId, action.settingData).pipe(
        map(() => new UpdatePolicyAction(action.policyId)),
        tap(() => {
          this.operationsTrackerService.trackSuccess(action.policyId, TrackOperations.UPDATE_POLICY_SETTINGS);
        }),
        catchError(() => {
          this.operationsTrackerService.trackError(
            action.policyId,
            new Error(),
            TrackOperations.UPDATE_POLICY_SETTINGS
          );
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  approveOnBehalf$: Observable<Action> = this.actions$.pipe(
    ofType(PolicyActionType.EditApproveOnBehalf),
    mergeMap((action: EditApproveOnBehalfAction) => {
      return this.policiesHttpService.approveOnBehalf(action.policyId, action.approve).pipe(
        mergeMap(() => this.policiesHttpService.getPolicy(action.policyId)),
        map((updatedPolicy) => new PolicyUpdatedAction(updatedPolicy.policy_id, updatedPolicy)),
        tap(() => {
          this.operationsTrackerService.trackSuccess(action.policyId, TrackOperations.APPROVE_ON_BEHALF_UPDATED);
        }),
        catchError(() => {
          this.operationsTrackerService.trackError(
            action.policyId,
            new Error(),
            TrackOperations.APPROVE_ON_BEHALF_UPDATED
          );
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  sharePolicies$: Observable<Action> = this.actions$.pipe(
    ofType(PolicyActionType.SharePolicy),
    mergeMap((action: SharePolicyAction) => {
      return this.policiesHttpService.sharePolicy(action.policyId, action.policyShare).pipe(
        tap(({ link }) => {
          this.operationsTrackerService.trackSuccessWithData(action.policyId, link, TrackOperations.SHARE_POLICY);
        }),
        catchError(() => {
          this.operationsTrackerService.trackError(action.policyId, new Error(), TrackOperations.SHARE_POLICY);
          return EMPTY;
        }),
        mergeMap(() => [
          new UpdatePolicyAction(action.policyId),
          new PolicySharedAction(action.policyId, action.policyShare),
        ])
      );
    })
  );
}
