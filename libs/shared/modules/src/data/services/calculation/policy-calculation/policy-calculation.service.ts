import { Injectable } from '@angular/core';
import { CalculatedPolicy, convertToEvidenceLike, ResourceStatusEnum } from '../../../models';
import { ApprovalFrequencyEnum, ApproverInstance, NotifyMeEnum, Policy } from '../../../models/domain';
import { ApproverRoleEnum } from 'core/models';


@Injectable()
export class PolicyCalculationService {
  calculatePolicy(policy: Policy): CalculatedPolicy {
    const calculatedPolicy: CalculatedPolicy = {
      ...policy,
      related_evidences: [],
      status: policy.evidence ? ResourceStatusEnum.NOTSTARTED : ResourceStatusEnum.UNDEFINED,
      has_roles: false,
    };

    if (policy.evidence && policy.policy_settings?.scheduling?.start_from) {
      calculatedPolicy.related_evidences.push(convertToEvidenceLike(policy.evidence));
      return this.calculateAllPolicyStatuses(calculatedPolicy);
    }

    return calculatedPolicy;
  }

  calculateAllPolicyStatuses(policyBase: CalculatedPolicy): CalculatedPolicy {
    policyBase.approvers_statuses = [];

    const settings = policyBase.policy_settings;
    const approvers = settings.approvers;
    const reviewers = settings.reviewers;
    const owner = settings.owner;
    const noStakeholders = !(approvers.length || reviewers.length || owner);
    const isAutomated = settings.scheduling?.notify_approvers && settings.scheduling.notify_approvers !== NotifyMeEnum.Never;

    let anyPending = false;
    let anyOnHold = false;

    // Run for approvers
    approvers.forEach((a) => calculateApproversStatus(a, ApproverRoleEnum.Approver));
    // Run for reviewers
    reviewers.forEach((a) => calculateApproversStatus(a, ApproverRoleEnum.Reviewer));
    // Owner
    if (owner) {
      calculateApproversStatus(owner, ApproverRoleEnum.Owner);
    }

    calculatePolicyStatus();
    calculateNextCycleDate();
    policyBase.has_roles = !noStakeholders;

    function calculateApproversStatus(approveInstance: ApproverInstance, type: ApproverRoleEnum): void {
        let approverStatus = ResourceStatusEnum.APPROVED;
        if (!approveInstance.approved) {
          approverStatus = isAutomated || approveInstance.last_notified ? ResourceStatusEnum.PENDING : ResourceStatusEnum.ON_HOLD;
        }

        if (!anyOnHold && approverStatus === ResourceStatusEnum.ON_HOLD) {
          anyOnHold = true;
        }

        if (!anyPending && approverStatus === ResourceStatusEnum.PENDING) {
          anyPending = true;
        }

        policyBase.approvers_statuses.push({ ...approveInstance, status: approverStatus, type });
    }

    function calculatePolicyStatus(): void {
      if (noStakeholders || anyPending || anyOnHold) {
        policyBase.status = anyPending ? ResourceStatusEnum.PENDING : ResourceStatusEnum.ON_HOLD;
      } else {
        policyBase.status = ResourceStatusEnum.APPROVED;
      }
    }

    function calculateNextCycleDate(): void {
      let interval: { type: string; interval: number };
      switch (settings.scheduling.approval_frequency) {
        case ApprovalFrequencyEnum.Yearly:
          interval = { type: 'FullYear', interval: 1 };
          break;
        case ApprovalFrequencyEnum.Monthly:
          interval = { type: 'Month', interval: 1 };
          break;
        case ApprovalFrequencyEnum.Quarterly:
          interval = { type: 'Month', interval: 4 };
          break;
        default:
          return;
      }
      const setget = { set: 'set' + interval.type, get: 'get' + interval.type };
      let nextDate = settings.scheduling.start_from;
      if (typeof nextDate === 'string') {
        nextDate = new Date(Date.parse(nextDate));
      }
      const now = new Date(Date.now());
      do {
        nextDate[setget.set](nextDate[setget.get]() + interval.interval);
      } while (nextDate < now);

      policyBase.next_cycle_date = nextDate;
    }

    return policyBase;
  }
}
