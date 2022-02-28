import { Injectable } from '@angular/core';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceSourcesEnum, ModalWindowWithSwitcher } from 'core';
import { EvidencePreviewModalSwitcher } from '../constants/index';
import { EvidenceInstance } from 'core/modules/data/models/domain';

export interface EvidencePreviewModalsContext {
  eventSource?: EvidenceSourcesEnum;
  evidence: EvidenceInstance;
  entityPath?: string[];
}

@Injectable()
export class EvidencePreviewService {
  constructor(private modalWindowService: ModalWindowService) {}

  openEvidencePreviewModal(context: EvidencePreviewModalsContext): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<EvidencePreviewModalsContext> = {
      componentsToSwitch: EvidencePreviewModalSwitcher,
      context: context,
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
