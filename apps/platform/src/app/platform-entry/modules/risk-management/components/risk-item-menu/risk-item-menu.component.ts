import { Component, Input } from '@angular/core';
import { MenuAction } from 'core/modules/dropdown-menu';
import { GenericModalsService } from 'core/modules/modals';
import { RiskFacadeService } from 'core/modules/risk/services';

@Component({
  selector: 'app-risk-item-menu',
  templateUrl: './risk-item-menu.component.html',
})
export class RiskItemMenuComponent {
  @Input()
  riskId: string;

  menuActions: MenuAction[] = [
    {
      id: 'deleteRisk',
      translationKey: this.buildTranslationKey('deleteRisk'),
      action: () => this.deleteAsync(),
    },
  ];

  constructor(private riskFacadeService: RiskFacadeService, private genericModals: GenericModalsService) {}

  threeDotsMenuClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.riskItemMenu.${relativeKey}`;
  }

  private async deleteAsync(): Promise<void> {
    if (await this.openDeleteConfirmationModal()) {
      this.riskFacadeService.deleteRisk(this.riskId);
    }
  }

  private openDeleteConfirmationModal(): Promise<boolean> {
    return this.genericModals.openConfirmationModal({
      confirmTranslationKey: this.buildTranslationKey('deleteRiskConfirmationModal.confirmTranslationKey'),
      dismissTranslationKey: this.buildTranslationKey('deleteRiskConfirmationModal.dismissTranslationKey'),
      questionTranslationKey: this.buildTranslationKey('deleteRiskConfirmationModal.questionTranslationKey'),
      aftermathTranslationKey: this.buildTranslationKey('deleteRiskConfirmationModal.aftermathTranslationKey'),
    });
  }
}
