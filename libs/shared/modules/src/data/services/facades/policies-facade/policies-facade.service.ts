import { createSortCallback } from 'core/utils';
import { ResourceStatusEnum } from './../../../models/resource-status.enum';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TrackOperations } from '../../operations-tracker/constants/track.operations.list.constant';
import {
  AddCustomPolicyAction,
  EditApproveOnBehalfAction,
  EditCustomPolicyAction,
  EditPolicySettingsAction,
  InitPoliciesStateAction,
  RemoveCustomPolicyAction,
  SharePolicyAction,
} from '../../../store/actions';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { CustomItemModel } from '../../../../customization/models';
import { ResourceType, CalculatedPolicy } from '../../../models';
import { CustomPolicy, Policy, PolicySettings, PolicyShare, ApproveOnBehalf } from '../../../models/domain';
import { AddEvidenceToResourceAction, UpdateEvidenceOfResourceAction } from '../../../store/actions/evidences.actions';
import { State } from '../../../store/state';
import { ActionDispatcherService } from '../../action-dispatcher/action-dispatcher.service';
import { PolicyService } from '../../policy/policy.service';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { PolicyTypesEnum } from 'core/modules/data/models';

@Injectable()
export class PoliciesFacadeService {
  private allPoliciesCache$: Observable<Array<CalculatedPolicy>>;
  private allApplicablePolicies$: Observable<Array<Policy>>;
  private allNotApplicablePolicies$: Observable<Array<Policy>>;

  constructor(
    private store: Store<State>,
    private actionDispatcher: ActionDispatcherService,
    private policyService: PolicyService,
    private policyManagerEventService: PolicyManagerEventService
  ) {
    this.allPoliciesCache$ = this.store
      .select((x) => x.calculationState.arePoliciesCalculated)
      .pipe(
        tap((areCalculated) => {
          if (!areCalculated) {
            this.store.dispatch(new InitPoliciesStateAction());
          }
        }),
        filter((areCalculated) => areCalculated),
        switchMap((_) => this.store.select((state) => state.calculationState.calculatedPolicies.entities)),
        map((calculatedPolicies) => Object.values(calculatedPolicies)),
        shareReplay()
      );
  }

  // **** GETTERS ****

  getAllPolicies(): Observable<Array<Policy>> {
    return this.allPoliciesCache$;
  }

  getAllStartedPolicies(): Observable<Array<Policy>> {
    return this.getAllApplicablePolicies().pipe(map((policies) => policies.filter((policy) => !!policy.evidence)));
  }

  getAllApplicablePolicies(): Observable<Array<CalculatedPolicy>> {
    if (!this.allApplicablePolicies$) {
      this.allApplicablePolicies$ = this.allPoliciesCache$.pipe(
        map((policies) => policies.filter((policy) => policy.policy_is_applicable)),
        shareReplay()
      );
    }
    return this.allApplicablePolicies$;
  }

  getAllNotApplicablePolicies(): Observable<Array<CalculatedPolicy>> {
    if (!this.allNotApplicablePolicies$) {
      this.allNotApplicablePolicies$ = this.allPoliciesCache$.pipe(
        map((policies) => policies.filter((policy) => !policy.policy_is_applicable)),
        shareReplay()
      );
    }
    return this.allNotApplicablePolicies$;
  }

  getPolicy(policyId: string): Observable<CalculatedPolicy> {
    return this.store.select((state) => state.calculationState.calculatedPolicies.entities[policyId]);
  }

  getAllApplicableWithCategoriesOrderAndSort(): Observable<Array<CalculatedPolicy>> {
    if (!this.allApplicablePolicies$) {
      this.allApplicablePolicies$ = this.allPoliciesCache$.pipe(
        map((policies) => policies.filter((policy) => policy.policy_is_applicable)),
        shareReplay()
      );
    }

    return this.allApplicablePolicies$.pipe(
      map((policies) => policies.filter((policy) => policy.policy_is_applicable)),
      map((policies) => {
        policies = policies.sort(createSortCallback((policy) => policy.policy_name));

        const approved = policies.filter(
          (policy) => (policy as CalculatedPolicy).status === ResourceStatusEnum.APPROVED
        );
        const inProgress = policies.filter(
          (policy) =>
            (policy as CalculatedPolicy).status !== ResourceStatusEnum.APPROVED &&
            (policy as CalculatedPolicy).status !== ResourceStatusEnum.UNDEFINED
        );
        const empty = policies.filter((policy) => (policy as CalculatedPolicy).status === ResourceStatusEnum.UNDEFINED);
        return [...approved, ...inProgress, ...empty];
      }),
      shareReplay()
    );
  }

  getPolicyTypesSorted(): Observable<string[]> {
    return this.getAllApplicableWithCategoriesOrderAndSort()
      .pipe(
        map((policies) => 
          [...new Set(
            policies
            .filter((policy) => (policy.policy_type) && policy.policy_type !== PolicyTypesEnum.Other)
            .flatMap((policy) => policy.policy_type)),
            PolicyTypesEnum.Other
          ]
        )
      );
  }

  // **** POLICY CUSTOMIZATION ****

  addCustomPolicy(payload: CustomItemModel | CustomPolicy): Promise<string | void> {
    if ('policy_id' in payload) {
      return this.editCustomPolicy(payload.policy_id, payload, true);
    }
    const model = payload as CustomItemModel;
    const addeddItem = {
      policy_name: model.name,
      policy_type: model.type,
      policy_description: model.description ?? '',
    };
    return this.actionDispatcher.dispatchActionAsync(
      new AddCustomPolicyAction(addeddItem),
      TrackOperations.ADD_CUSTOM_POLICY
    );
  }

  editCustomPolicy(
    policyId: string,
    payload: CustomItemModel | CustomPolicy,
    createFromExisting = false
  ): Promise<string> {
    const editedItem = createFromExisting
      ? {
        policy_name: (payload as CustomPolicy).policy_name,
        policy_type: (payload as CustomPolicy).policy_type,
        policy_description: (payload as CustomPolicy).policy_description || '',
      }
      : {
        policy_name: (payload as CustomItemModel).name,
        policy_type: (payload as CustomItemModel).type,
        policy_description: (payload as CustomItemModel).description || '',
      };
    return this.actionDispatcher.dispatchActionAsync(
      new EditCustomPolicyAction(policyId, editedItem),
      policyId,
      TrackOperations.UPDATE_CUSTOM_POLICY
    );
  }

  removePolicy(policy: Policy): Promise<void> {
    this.policyManagerEventService.trackRemovePolicyEvent(policy);
    return this.actionDispatcher.dispatchActionAsync(
      new RemoveCustomPolicyAction(policy),
      policy.policy_id,
      TrackOperations.DELETE_CUSTOM_POLICY
    );
  }

  // **** EVIDENCE ACTIONS ****

  addEvidenceToPolicy(policy_id: string, service_id: string, service_instance_id: string, evidence?: File, link?: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      new AddEvidenceToResourceAction({
        resourceType: ResourceType.Policy,
        resource_id: policy_id,
        service_id,
        service_instance_id,
        evidence,
        link,
      }),
      TrackOperations.ADD_EVIDENCE_POLICY
    );
  }
  updateEvidencePolicy(
    policy_id: string,
    service_id: string,
    service_instance_id: string,
    evidence_id: string,
    evidence?: File,
    link?: string
  ): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      new UpdateEvidenceOfResourceAction({
        resourceType: ResourceType.Policy,
        resource_id: policy_id,
        evidence_id,
        service_id,
        service_instance_id,
        evidence,
        link,
      }),
      TrackOperations.UPDATE_EVIDENCE_POLICY
    );
  }

  async downloadPolicyTemplate(policy: Policy): Promise<any> {
    if (policy.policy_has_template) {
      await this.policyService.downloadTemplate(policy.policy_id).toPromise();
    }
  }

  // Policy settings
  editPolicySettings(policy: Policy, payload: PolicySettings): Promise<void> {
    this.policyManagerEventService.trackSavePolicySettingsEvent(policy, payload);
    return this.actionDispatcher.dispatchActionAsync(
      new EditPolicySettingsAction(policy.policy_id, payload),
      policy.policy_id,
      TrackOperations.UPDATE_POLICY_SETTINGS
    );
  }
  // Policy settings
  approveOnBehalf(policyId: string, payload: ApproveOnBehalf): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      new EditApproveOnBehalfAction(policyId, payload),
      policyId,
      TrackOperations.APPROVE_ON_BEHALF_UPDATED
    );
  }

  // Policy Share - resend/copy link

  async sharePolicy(policyId: string, payload: PolicyShare, isLink: boolean, isResend: boolean): Promise<string> {
    const policy = await this.getPolicy(policyId).pipe(take(1)).toPromise();
    this.policyManagerEventService.trackSendPolicyForApprovalEvent(policy, isLink, isResend);
    return this.actionDispatcher.dispatchActionAsync(
      new SharePolicyAction(policyId, payload),
      policyId,
      TrackOperations.SHARE_POLICY
    );
  }
}
