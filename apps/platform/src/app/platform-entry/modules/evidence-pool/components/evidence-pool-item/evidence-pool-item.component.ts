import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit } from '@angular/core';
import { EvidenceTypeIconMapping } from 'core/models/evidence-type-icon.mapping';
import { convertToEvidenceLike } from 'core/modules/data/models';
import { EvidenceInstance } from 'core/modules/data/models/domain';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';
import { RootTranslationkey } from './../../constants/translation-keys.constant';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { EvidenceModalService } from 'core/modules/shared-controls/modules/evidence/services';
import { EvidencePreviewService } from 'core/modules/shared-controls/services';

@Component({
  selector: 'app-evidence-pool-item',
  templateUrl: './evidence-pool-item.component.html',
  styleUrls: ['./evidence-pool-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidencePoolItemComponent implements OnInit {
  evidenceSource = EvidenceSourcesEnum.EvidencePool;
  fileTypeMapping: { icon: string };

  @Input()
  evidence: EvidenceInstance;

  @HostListener('click', ['$event'])
  private hostClick(event: MouseEvent): void {
    this.openFullData();
  }

  constructor(
    private evidenceEventService: EvidenceUserEventService,
    private evidenceModalService: EvidenceModalService,
    private evidencePreviewService: EvidencePreviewService,
  ) {}

  ngOnInit(): void {
    this.fileTypeMapping = EvidenceTypeIconMapping[this.evidence.evidence_type];
  }

  clickOnLinkEvidenceButton(event: MouseEvent): void {
    event.stopPropagation();
    this.openLinkEvidenceModal();
  }

  rowTrackBy(evidence: EvidenceInstance): any {
    return evidence?.evidence_id;
  }

  buildTranslationKey(key: string): string {
    return `${RootTranslationkey}.evidencePoolItem.${key}`;
  }

  private openLinkEvidenceModal(): void {
    this.evidenceModalService.openEvidenceConnectComponent(convertToEvidenceLike(this.evidence));
  }

  private async openFullData(): Promise<void> {
    this.evidencePreviewService.openEvidencePreviewModal({
      eventSource: this.evidenceSource,
      evidence: this.evidence,
    });

    await this.evidenceEventService.trackViewFullData(
      this.evidence.evidence_id,
      this.evidence.evidence_name,
      this.evidence.evidence_type,
    );
  }
}
