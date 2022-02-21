import {
  CalculatedPolicy,
  CalculatedRequirement,
  convertToEvidenceLike,
  EvidenceLike,
  isPolicy,
  ResourceType,
} from 'core/modules/data/models';
import { MenuAction } from 'core/modules/dropdown-menu';
import { Policy } from '../../data/models/domain';

export interface RequirementLike {
  name?: string;
  resourceId?: string;
  resourceType?: ResourceType;
  description?: string;
  isEnabled?: boolean;
  isCustom?: boolean;
  threeDotsMenuActions?: MenuAction<any>[];
  translationRootKey?: string;
  menuContext?: any;
  evidence?: EvidenceLike[];
  addedBy?: string;
  lastEditTime?: number | string;
  resource?: CalculatedRequirement | Policy;
  relatedFrameworksNames?: { [framework_name: string]: string[] };
  type?: string;
}

export function convertToRequirementLike(entity: CalculatedRequirement | CalculatedPolicy): RequirementLike {
  if (!entity) {
    return undefined;
  }
  if (isPolicy(entity)) {
    return {
      resourceId: entity.policy_id,
      resourceType: ResourceType.Policy,
      name: entity.policy_name ?? '',
      type: entity.policy_type,
      description: entity.policy_description,
      isEnabled: true,
      isCustom: entity.policy_is_custom,
      lastEditTime: entity.policy_last_edit_time || 0,
      addedBy: entity.policy_edited_by,
      evidence: entity.evidence ? [convertToEvidenceLike(entity.evidence)] : [],
      resource: entity,
      relatedFrameworksNames: entity.policy_related_frameworks_names || {},
    };
  } else {
    return {
      resourceId: entity.requirement_id,
      name: entity.requirement_name,
      isEnabled: entity.requirement_applicability,
      description: entity.requirement_help,
      isCustom: entity.requirement_is_custom,
      lastEditTime: entity.requirement_last_edit_time || 0,
      addedBy: entity.requirement_edited_by,
      evidence: entity.requirement_related_evidences,
      resourceType: ResourceType.Requirement,
      resource: entity,
    };
  }
}
