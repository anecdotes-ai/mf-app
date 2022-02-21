import { Injectable } from '@angular/core';
import { EvidenceSourcesEnum, ModalWindowWithSwitcher } from 'core';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceFromPolicyModalsSwitcher } from '../constants/index';
import {
  ControlRequirement,
  Framework,
} from 'core/modules/data/models/domain';
import { CalculatedControl, EvidenceLike } from 'core/modules/data/models';

export interface EvidenceFromPolicyModalsContext {
  eventSource: EvidenceSourcesEnum;
  evidenceLike: EvidenceLike;
  controlInstance: CalculatedControl;
  controlRequirement: ControlRequirement;
  framework: Framework;
}

@Injectable({ providedIn: 'root' })
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
