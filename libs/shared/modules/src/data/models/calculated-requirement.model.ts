import { EvidenceLike } from './evidence-like.model';
import { ControlRequirement } from './domain';

export interface CalculatedRequirement extends ControlRequirement {
  /**
   * Sorted requirement related evidence
   */
  requirement_related_evidences?: EvidenceLike[];
}

export function isRequirement(object: any): object is ControlRequirement {
  return 'requirement_related_policies_ids' in object;
}
