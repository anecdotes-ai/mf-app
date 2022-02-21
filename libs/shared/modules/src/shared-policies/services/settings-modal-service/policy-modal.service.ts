import { Injectable } from '@angular/core';
import { ModalWindowWithSwitcher } from 'core/models/modal-window.model';
import { ModalWindowService } from 'core/modules/modals';
import { SendForApprovalModals, SettingsSwitcherModals } from '../constants';
import { SettingsContext } from '../../models/settings-context';
import { ApproveOnBehalfModals } from 'core/modules/shared-policies/services/constants/approve-on-behalf-modal.constants';
import { ApproveOnBehalfContext } from 'core/modules/shared-policies/models/approve-on-behalf-context';
import { SendForApprovalContext } from '../../models/send-for-approval-context';

@Injectable()
export class PolicyModalService {
  constructor(private modalWindowService: ModalWindowService) { }
 
  addPolicySettingsModal(context: SettingsContext): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<SettingsContext> = {
      componentsToSwitch: SettingsSwitcherModals,
      context: { translationKey: 'policyManager.settings', ...context },
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }

  approveOnBehalf(context: ApproveOnBehalfContext): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<ApproveOnBehalfContext> = {
      componentsToSwitch: ApproveOnBehalfModals,
      context: { translationKey: 'policyManager.approveOnBehalf', ...context },
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }

  sendForApproval(context: SendForApprovalContext): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<SendForApprovalContext> = {
      componentsToSwitch: SendForApprovalModals,
      context: { translationKey: 'policyManager.sendForApproval', ...context },
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
