import { CombinedEvidenceInstance, EvidenceStatusEnum, EvidenceTypeEnum, isPolicy, Policy } from './domain';
import { ResourceType } from './resource-type.enum';

export interface EvidenceLike {
  id?: string;
  name?: string;
  is_applicable?: boolean;
  service_id?: string;
  service_display_name?: string;
  type?: EvidenceTypeEnum;
  status?: EvidenceStatusEnum;
  resourceType?: ResourceType;
  evidence?: CombinedEvidenceInstance;
  snapshot_id?: string;
}

export function convertToEvidenceLike(evidence: Policy | CombinedEvidenceInstance): EvidenceLike {
  return isPolicy(evidence)
    ? {
        id: evidence.policy_id,
        name: evidence.evidence.evidence_name,
        is_applicable: evidence.policy_is_applicable,
        service_id: evidence.evidence.evidence_service_id,
        status: evidence.evidence.evidence_status,
        type: evidence.evidence.evidence_type,
        service_display_name: evidence.evidence.evidence_service_display_name,
        evidence: evidence.evidence,
        resourceType: ResourceType.Policy,
        snapshot_id: evidence.snapshot_id
      }
    : {
        id: evidence.evidence_id,
        name: evidence.evidence_name,
        is_applicable: evidence.evidence_is_applicable,
        service_id: evidence.evidence_service_id,
        status: evidence.evidence_status,
        service_display_name: evidence.evidence_service_display_name,
        type: evidence.evidence_type,
        evidence: evidence,
        resourceType: ResourceType.Evidence,
        snapshot_id: evidence.snapshot_id
      };
}
