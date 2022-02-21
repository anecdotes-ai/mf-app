import { CalculatedControl } from '../models/calculated-control.model';
import { CalculatedRequirement } from './calculated-requirement.model';
import { EvidenceInstance } from './domain';

export interface CalculatedEvidence extends EvidenceInstance {
  related_requirement?: CalculatedRequirement;
  related_control?: CalculatedControl;
  /** @deprecated Must be removed. The value of this property is used only by linked-controls-label.component */
  related_controls?: CalculatedControl[];
  evidence_related_framework_names?: { [frameworkName: string]: string[] };
}
