import { ResourceStatusEnum } from './resource-status.enum';
import { ApproverInstance } from './domain';
import { ApproverRoleEnum } from 'core/models';

export interface CalculatedApprover extends ApproverInstance {
  status?: ResourceStatusEnum;
  type?: ApproverRoleEnum;
}
