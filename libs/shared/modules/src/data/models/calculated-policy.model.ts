import { ResourceStatusEnum } from './resource-status.enum';
import { EvidenceLike } from './';
import { Policy } from './domain';
import { CalculatedApprover } from './calculated-approver';

export interface CalculatedPolicy extends Policy {
  related_evidences?: EvidenceLike[];
  status?: ResourceStatusEnum;
  approvers_statuses?: CalculatedApprover[];
  next_cycle_date?: Date;
  has_roles?: boolean;
}
