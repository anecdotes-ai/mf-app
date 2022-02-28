import { Injectable } from '@angular/core';
import { EvidenceSourcesEnum, ModalWindowWithSwitcher } from 'core';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceFromPolicyModalsSwitcher } from '../constants/index';
import { EvidenceLike } from 'core/modules/data/models';

export interface EvidenceFromPolicyModalsContext {
  eventSource: EvidenceSourcesEnum;
  evidenceLike: EvidenceLike;
  entityPath: string[];
}

@Injectable()
export class EvidenceFromPolicyPreviewService {
  constructor(private modalWindowService: ModalWindowService) {}

  openEvidenceFromPolicyPreviewModal(context: EvidenceFromPolicyModalsContext): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<EvidenceFromPolicyModalsContext> = {
      componentsToSwitch: EvidenceFromPolicyModalsSwitcher,
      context: context,
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
