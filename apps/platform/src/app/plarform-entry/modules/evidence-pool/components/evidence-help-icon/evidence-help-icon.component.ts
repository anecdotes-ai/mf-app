import { MAX_API_CALLS } from 'core/modules/data/constants/evidence';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { EvidenceInstance } from 'core/modules/data/models/domain';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-evidence-help-icon',
  templateUrl: './evidence-help-icon.component.html',
  styleUrls: ['./evidence-help-icon.component.scss']
})
export class EvidenceHelpIconComponent {
  maxApiCalls = MAX_API_CALLS;

  @Input()
  evidence: EvidenceInstance;

  @Input()
  placement = 'bottom-left';

  constructor(private windowHelper: WindowHelperService) { }

  buildTranslationKey(relativeKey: string): string {
    return `evidencePreview.${relativeKey}`;
  }

  viewRawData(): void {
    this.windowHelper.openUrlInNewTab(
      `${this.windowHelper.getWindow().location.origin}/view-evidence/${this.evidence.evidence_instance_id}/raw`
    );
  }
}
