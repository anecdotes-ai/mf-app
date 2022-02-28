import { Component, Input } from '@angular/core';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';
import { CombinedEvidenceInstance } from 'core/modules/data/models/domain';
import { DateViewTypeEnum } from 'core/modules/shared-controls/constants/dateViewType';

@Component({
  selector: 'app-evidence-preview-item',
  templateUrl: './evidence-preview-item.component.html',
  styleUrls: ['./evidence-preview-item.component.scss'],
})
export class EvidencePreviewItemComponent {
  evidenceSources = EvidenceSourcesEnum;
  dateViewTypes = DateViewTypeEnum;

  @Input() evidence: CombinedEvidenceInstance;

  @Input() shouldDisplayExportButton = false;

  @Input()
  searchItemAmount: number;

  @Input()
  evidenceDistinct: any;

  @Input()
  evidenceFullData: any;

  @Input()
  isDataToPreviewExists: boolean;

  @Input()
  sourceOfPreviewOpen: EvidenceSourcesEnum;

  get evidenceComply(): boolean {
    return this.evidence.evidence_gap === null;
  }

  buildTranslationKey(relativeKey: string): string {
    return `evidencePreview.file.${relativeKey}`;
  }
}
