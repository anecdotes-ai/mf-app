import { ApproverInstance, ApproverTypeEnum } from 'core/modules/data/models/domain';

export interface ApproveOnBehalfContext {
  policyId: string;
  approverInstance: ApproverInstance;
  approved: boolean;
  translationKey?: string;
  approverType: ApproverTypeEnum;
}
