import { translationRootKey } from '../../models/constants';
import { ModalWindowService } from 'core/modules/modals/services/modal-window/modal-window.service';
import { Injectable } from '@angular/core';
import {
  ConfirmationModalWindowComponent,
  ConfirmationModalWindowInputKeys,
  StatusModalWindowInputKeys,
  StatusType,
  StatusWindowModalComponent,
} from 'core/modules/modals/components';
import { IntercomService } from 'core/services/intercom/intercom.service';

export const agentManagementTranslationKey = 'agentManagement';

@Injectable()
export class AgentModalService {
  constructor(private modalService: ModalWindowService, private intercom: IntercomService) {}

  openRegenerateApiModal(handler: () => void): void {
    this.modalService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'regenerate-modal',
          componentType: ConfirmationModalWindowComponent,
          contextData: {
            [ConfirmationModalWindowInputKeys.aftermathTranslationKey]: this.buildTranslationKey(
              'infoTab.regenerateKey.aftermath'
            ),
            [ConfirmationModalWindowInputKeys.confirmTranslationKey]: this.buildTranslationKey(
              'infoTab.regenerateKey.confirmation'
            ),
            [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]: () => handler(),
            [ConfirmationModalWindowInputKeys.dismissTranslationKey]: this.buildTranslationKey(
              'infoTab.regenerateKey.dismiss'
            ),
            [ConfirmationModalWindowInputKeys.icon]: 'status_not_started',
            [ConfirmationModalWindowInputKeys.questionTranslationKey]: this.buildTranslationKey(
              'infoTab.regenerateKey.question'
            ),
            [ConfirmationModalWindowInputKeys.successWindowSwitcherId]: 'regenerate-api-key-success',
            [ConfirmationModalWindowInputKeys.errorWindowSwitcherId]: 'regenerate-api-key-error',
          },
        },
        {
          id: 'regenerate-api-key-success',
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
            [StatusModalWindowInputKeys.translationKey]: this.buildTranslationKey('infoTab.successApiRegenerate'),
          },
        },
        {
          id: 'regenerate-api-key-error',
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
            [StatusModalWindowInputKeys.translationKey]: this.buildTranslationKey('infoTab.errorApiRegenerate'),
          },
        },
      ],
    });
  }

  openRemoveAgentConfirmationModals(handler: () => Promise<void>): void {
    this.modalService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'removeAgent-modal',
          componentType: ConfirmationModalWindowComponent,
          contextData: {
            [ConfirmationModalWindowInputKeys.aftermathTranslationKey]: this.buildTranslationKey(
              'removeAgent.aftermath'
            ),
            [ConfirmationModalWindowInputKeys.confirmTranslationKey]: this.buildTranslationKey(
              'removeAgent.confirmation'
            ),
            [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]: async () => {
              await handler();
            },
            [ConfirmationModalWindowInputKeys.dismissTranslationKey]: this.buildTranslationKey('removeAgent.dismiss'),
            [ConfirmationModalWindowInputKeys.closeModalAfterDismissing]: true,
            [ConfirmationModalWindowInputKeys.icon]: 'status_not_started',
            [ConfirmationModalWindowInputKeys.questionTranslationKey]: this.buildTranslationKey('removeAgent.question'),
            [ConfirmationModalWindowInputKeys.errorWindowSwitcherId]: 'remove-agent-error',
          },
        },
        {
          id: 'remove-agent-error',
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.translationKey]: this.buildTranslationKey('errorAgentRemoval'),
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
          },
        },
      ],
    });
  }

  openAgentFailedToCreate(errorCode?: number): void {
    this.modalService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'agent-failed-to-create-modal',
          componentType: ConfirmationModalWindowComponent,
          contextData: {
            [ConfirmationModalWindowInputKeys.aftermathTranslationKey]: this.buildTranslationKey(
              errorCode === 409
                ? 'agentFailedToCreate.connectorWithSuchNameExists'
                : 'agentFailedToCreate.aftermath'
            ),
            [ConfirmationModalWindowInputKeys.confirmTranslationKey]: this.buildTranslationKey(
              'agentFailedToCreate.confirmation'
            ),
            [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]: () => {
              window.location.reload();
            },
            [ConfirmationModalWindowInputKeys.dismissTranslationKey]: this.buildTranslationKey(
              'agentFailedToCreate.dismiss'
            ),
            [ConfirmationModalWindowInputKeys.dismissHandlerFunction]: () => {
              this.intercom.openMessanger();
            },
            [ConfirmationModalWindowInputKeys.icon]: 'status_not_started',
            [ConfirmationModalWindowInputKeys.questionTranslationKey]: this.buildTranslationKey(
              'agentFailedToCreate.question'
            ),
            [ConfirmationModalWindowInputKeys.closeModalAfterDismissing]: true,
          },
        },
      ],
    });
  }

  private buildTranslationKey(key: string): string {
    return `${translationRootKey}.${agentManagementTranslationKey}.${key}`;
  }
}
