import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { CalculatedPolicy } from 'core/modules/data/models';
import { PolicyAddType, PolicyManagerEventData, PolicyManagerEventDataProperty, UserEvents } from 'core/models';
import { selectPolicyById, State } from 'core/modules/data/store';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { PolicySettings } from 'core/modules/data/models/domain';

@Injectable({
  providedIn: 'root',
})
export class PolicyManagerEventService {
  constructor(
    private userEventService: UserEventService,
    private store: Store<State>,
  ) {}

  trackAddPolicyEvent(policy: CalculatedPolicy, addType: PolicyAddType): void {
    this.userEventService.sendEvent(UserEvents.ADD_POLICY, {
      [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
      [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
      [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
      [PolicyManagerEventDataProperty.PolicyAddType]: addType,
    });
  }

  trackUpdatePolicyEvent(policy: CalculatedPolicy): void {
    this.userEventService.sendEvent(UserEvents.UPDATE_POLICY, {
      [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
      [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
      [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
    });
  }

  trackRemovePolicyEvent(policy: CalculatedPolicy): void {
    this.userEventService.sendEvent(UserEvents.REMOVE_POLICY, {
      [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
      [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
      [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
    });
  }

  async trackUploadPolicyFileEvent(policyId: string, fileName: string): Promise<void> {
    const eventData = await this.prepareEventDataForPolicyAsync(policyId, fileName);

    this.userEventService.sendEvent(UserEvents.UPLOAD_FILE, eventData);
  }

  trackDownloadPolicyTemplateEvent(policy: CalculatedPolicy): void {
    this.userEventService.sendEvent(UserEvents.DOWNLOAD_TEMPLATE, {
      [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
      [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
    });
  }

  async trackLinkPolicyEvent(policyId: string, pluginName: string): Promise<void> {
    const policy = await this.store.select(selectPolicyById(policyId))
      .pipe(take(1)).toPromise();

    this.userEventService.sendEvent(UserEvents.LINK_POLICY, {
      [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
      [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
      [PolicyManagerEventDataProperty.PluginUsed]: pluginName,
    });
  }

  trackCancelApprovalEvent(policy: CalculatedPolicy): void {
    this.userEventService.sendEvent(UserEvents.CANCEL_APPROVAL, {
      [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
      [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
      [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
    });
  }

  trackApproveOnBehalfEvent(policy: CalculatedPolicy): void {
    this.userEventService.sendEvent(UserEvents.APPROVE_ON_BEHALF, {
      [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
      [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
      [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
    });
  }

  trackSendPolicyForApprovalEvent(policy: CalculatedPolicy, isLink: boolean, resent: boolean): void {
    this.userEventService.sendEvent(UserEvents.SEND_FOR_APPROVAL, {
      [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
      [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
      [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
      [PolicyManagerEventDataProperty.SentLink]: isLink ? 'custom link' : 'email',
      [PolicyManagerEventDataProperty.Resent]: resent,
    });
  }

  trackSavePolicySettingsEvent(policy: CalculatedPolicy, settings: PolicySettings): void {
    this.userEventService.sendEvent(UserEvents.SAVE_POLICY_SETTINGS, {
      [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
      [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
      [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
      [PolicyManagerEventDataProperty.AmountOfReviewers]: settings.reviewers.length,
      [PolicyManagerEventDataProperty.AmountOfApprovers]: settings.approvers.length,
      [PolicyManagerEventDataProperty.ApprovalFreq]: settings.scheduling.approval_frequency,
      [PolicyManagerEventDataProperty.NotifyMe]: settings.scheduling.notify_me,
      [PolicyManagerEventDataProperty.NotifyAssignedColleagues]: settings.scheduling.notify_approvers,
    });
  }

  trackLinkedControlClickEvent(policy: CalculatedPolicy, frameworkNames: string[], amountOfControls: number): void {
    this.userEventService.sendEvent(UserEvents.POLICY_LINKED, {
      [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
      [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
      [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
      [PolicyManagerEventDataProperty.FrameworksLinked]: frameworkNames.join(', '),
      [PolicyManagerEventDataProperty.AmountOfLinkedControls]: amountOfControls,
    });
  }

  private async prepareEventDataForPolicyAsync(policyId: string, fileName: string): Promise<PolicyManagerEventData> {
    const policy = await this.store.select(selectPolicyById(policyId)).pipe(take(1)).toPromise();
    const splitFileName = fileName.split('.');

    return {
      [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
      [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
      [PolicyManagerEventDataProperty.FileType]: splitFileName[splitFileName.length - 1],
    };
  }
}
