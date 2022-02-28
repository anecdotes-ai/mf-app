import { Component, HostBinding, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { EvidenceFacadeService } from 'core/modules/data/services';
import { EvidenceInstance } from 'core/modules/data/models/domain';
import { EvidencePreviewService } from 'core/modules/shared-controls';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-risk-evidence',
  templateUrl: './risk-evidence.component.html',
})
export class RiskEvidenceComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @HostBinding('class')
  private classes = 'block cursor-pointer';

  @Input()
  evidenceId: string;

  @Input()
  riskId: string;

  evidence: EvidenceInstance;

  constructor(private evidenceFacade: EvidenceFacadeService, private evidencePreviewService: EvidencePreviewService) {}

  ngOnInit(): void {
    this.evidenceFacade
      .getEvidence(this.evidenceId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((evidence) => (this.evidence = evidence));
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  @HostListener('click')
  private onClick(): void {
    this.evidencePreviewService.openEvidencePreviewModal({
      evidence: this.evidence,
    });
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.supportingDocuments.${relativeKey}`;
  }
}
