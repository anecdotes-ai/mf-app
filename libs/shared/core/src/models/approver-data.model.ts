import { ApproverRoleEnum } from './approver-role.enum';
import { ApproverInstance } from 'core/modules/data/models/domain';

export interface ApproverData {
  policy_id?: string;
  approver_type?: ApproverRoleEnum;
  approver?: ApproverInstance;
}
