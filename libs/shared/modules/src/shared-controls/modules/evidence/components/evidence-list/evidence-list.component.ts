import { Component, Input } from '@angular/core';
import { CalculatedControl, CalculatedEvidence } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { RequirementLike } from 'core/modules/shared-controls/models';

@Component({
  selector: 'app-evidence-list',
  templateUrl: './evidence-list.component.html',
  styleUrls: ['./evidence-list.component.scss'],
})
export class EvidenceListComponent {
  @Input()
  controlInstance: CalculatedControl;

  @Input()
  framework: Framework;

  @Input()
  requirementLike: RequirementLike;

  selecEvidenceId(evidence: CalculatedEvidence): string {
    return evidence.evidence_id;
  }

  buildTranslationKey(relativeKey: string): string {
    return `connectEvidenceModal.${relativeKey}`;
  }
}
