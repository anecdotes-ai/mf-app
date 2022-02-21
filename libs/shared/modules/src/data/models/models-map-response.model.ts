import { Control, ControlRequirement, EvidenceInstance } from './domain';

export interface ModelsMapResponse {
  controls: { [frameworkId: string]: Control[] } | Control[];
  evidence: EvidenceInstance[];
  requirements: ControlRequirement[];
}
