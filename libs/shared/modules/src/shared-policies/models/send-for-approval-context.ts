import { ApproverTypeEnum } from 'core/modules/data/models/domain';

export interface SendForApprovalContext {
  policyId?: string;
  leftCornerText?: string;
  approverEmail?: string;
  translationKey?: string;
  isResend?: boolean;
  approverType: ApproverTypeEnum;
}
