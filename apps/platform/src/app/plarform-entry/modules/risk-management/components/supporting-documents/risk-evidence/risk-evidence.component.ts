import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { EvidenceFacadeService } from 'core/modules/data/services';
import { EvidenceInstance } from 'core/modules/data/models/domain';
import { Observable } from 'rxjs';
import { EvidencePreviewService } from 'core/modules/shared-controls';

@Component({
  selector: 'app-risk-evidence',
  templateUrl: './risk-evidence.component.html'
})
export class RiskEvidenceComponent implements OnInit {
  @HostBinding('class')
  private classes = 'block cursor-pointer';

  @Input()
  evidenceId: string;

  @Input()
  riskId: string;

  evidence$: Observable<EvidenceInstance>;

  constructor(private evidenceFacade: EvidenceFacadeService, private evidencePreviewService: EvidencePreviewService) {}

  ngOnInit(): void {
    this.evidence$ = this.evidenceFacade.getEvidence(this.evidenceId);
  }

  @HostListener('click')
  private onClick(): void {
    this.evidencePreviewService.openEvidencePreviewModal({
      evidenceId: this.evidenceId,
    });
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.supportingDocuments.${relativeKey}`;
  }
}
