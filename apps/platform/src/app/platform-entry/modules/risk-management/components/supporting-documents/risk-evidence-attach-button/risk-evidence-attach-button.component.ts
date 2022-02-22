import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuAction } from 'core/modules/dropdown-menu';
import { RiskResourceType } from 'core/modules/risk/constants';
import { Risk } from 'core/modules/risk/models';
import { RiskFacadeService } from 'core/modules/risk/services';
import { EvidenceCollectionModalService } from 'core/modules/shared-controls';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-risk-evidence-attach-button',
  templateUrl: './risk-evidence-attach-button.component.html',
})
export class RiskEvidenceAttachButtonComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @Input()
  riskId: string;

  risk: Risk;
  menuActions: MenuAction[] = [
    {
      translationKey: this.buildTranslationKey('shareLink'),
      icon: 'linked-files',
      iconColorMode: 'fill',
      action: () => this.openLinkFilesModal(),
    },
    {
      translationKey: this.buildTranslationKey('uploadFile'),
      icon: 'manual-file',
      iconColorMode: 'fill',
      action: () => this.openFileBrowser(),
    },
  ];

  constructor(
    private evidenceCollectionModalService: EvidenceCollectionModalService,
    private riskFacade: RiskFacadeService
  ) {}

  ngOnInit(): void {
    this.riskFacade
      .getRiskById(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risk) => (this.risk = risk));
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.supportingDocuments.collectEvidenceMenu.${relativeKey}`;
  }

  private openFileBrowser(): void {
    this.evidenceCollectionModalService.openFileUploadingModal({
      targetResource: { resourceType: RiskResourceType, resourceId: this.riskId },
    });
  }

  private openLinkFilesModal(): void {
    this.evidenceCollectionModalService.openSharedLinkEvidenceCreationModal({
      targetResource: { resourceId: this.riskId, resourceType: RiskResourceType },
      entityPath: [this.risk.name],
    });
  }
}
