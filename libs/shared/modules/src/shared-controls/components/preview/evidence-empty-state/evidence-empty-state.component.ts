import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EvidenceInstance } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-evidence-empty-state',
  templateUrl: './evidence-empty-state.component.html',
  styleUrls: ['./evidence-empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvidenceEmptyStateComponent {
  @Input()
  evidence: EvidenceInstance;

  buildTranslationKey(relativeKey: string): string {
    return `evidencePreview.${relativeKey}`;
  }
}
