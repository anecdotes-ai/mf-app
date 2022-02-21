import { Component, Input } from '@angular/core';
import { MenuAction } from 'core/modules/dropdown-menu';
import { RiskFacadeService } from 'core/modules/risk/services';
import { GenericModalsService } from 'core/modules/modals';

@Component({
  selector: 'app-risk-evidence-menu',
  templateUrl: './risk-evidence-menu.component.html',
})
export class RiskEvidenceMenuComponent {
  private localStorageKey = 'delete-risk-evidence';

  @Input()
  evidenceId: string;

  @Input()
  riskId: string;

  menuActions: MenuAction[] = [
    {
      translationKey: this.buildTranslationKey('removeEvidenceOption'),
      action: () => this.removeAsync(),
    },
  ];
  
  constructor(private riskFacadeService: RiskFacadeService, private genericModalsService: GenericModalsService) { }

  private async removeAsync(): Promise<void> {

    if (!localStorage.getItem(this.localStorageKey)) {
    if (await this.genericModalsService.openConfirmationModal({
      confirmTranslationKey: this.buildTranslationKey('removeEvidenceConfirmationModal.yesBtn'),
      dismissTranslationKey: this.buildTranslationKey('removeEvidenceConfirmationModal.cancelBtn'),
      questionTranslationKey: this.buildTranslationKey('removeEvidenceConfirmationModal.question'),
      aftermathTranslationKey: this.buildTranslationKey('removeEvidenceConfirmationModal.aftermath'),
      localStorageKey: this.localStorageKey,
      dontShowTranslationKey: this.buildTranslationKey('removeEvidenceConfirmationModal.dontShowAgain')
    })) {
      this.riskFacadeService.removeEvidenceFromRisk(this.riskId, this.evidenceId);
    }
  } else {
    this.riskFacadeService.removeEvidenceFromRisk(this.riskId, this.evidenceId);
  }
  }
  

  private buildTranslationKey(relativeKey: string): string {
    return `riskManagement.supportingDocuments.${relativeKey}`;
  }
}
