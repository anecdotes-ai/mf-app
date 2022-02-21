import { EvidenceTypeEnum } from './domain';

export interface CollectingEvidence {
  evidenceId?: string;
  serviceId?: string;
  serviceDisplayName?: string;
  evidenceType: EvidenceTypeEnum;
  temporaryId?: string;
}
