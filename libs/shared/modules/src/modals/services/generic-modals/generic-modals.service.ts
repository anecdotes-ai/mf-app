import { ConfirmationModalWindowInputKeys } from '../../components/confirmation-modal-window/constants';
import { ConfirmationModalWindowComponent } from '../../components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalWindowService } from '../modal-window/modal-window.service';
import { Injectable } from '@angular/core';

@Injectable()
export class GenericModalsService {
  constructor(private modalWindow: ModalWindowService) {}

  /**
   * Opens confirmation modal and returns promise that:
   * 1. gets resolved with true when an action was confirmed
   * 2. gets resolved with false when an action was rejected
   * @param params configuration for the confirmation modal
   */
  openConfirmationModal(params: {
    confirmTranslationKey: string;
    dismissTranslationKey: string;
    questionTranslationKey: string;
    aftermathTranslationKey: string;
    localStorageKey?: string;
    dontShowTranslationKey?: string;
  }): Promise<boolean> {
    return new Promise((resolve, _) => {
      this.modalWindow.openInSwitcher({
        componentsToSwitch: [
          {
            id: 'confirmation-modal',
            componentType: ConfirmationModalWindowComponent,
            contextData: {
              [ConfirmationModalWindowInputKeys.icon]: 'status_not_started',
              [ConfirmationModalWindowInputKeys.closeModalAfterDismissing]: true,
              [ConfirmationModalWindowInputKeys.confirmTranslationKey]: params.confirmTranslationKey,
              [ConfirmationModalWindowInputKeys.dismissTranslationKey]: params.dismissTranslationKey,
              [ConfirmationModalWindowInputKeys.questionTranslationKey]: params.questionTranslationKey,
              [ConfirmationModalWindowInputKeys.aftermathTranslationKey]: params.aftermathTranslationKey,
              [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]: () => resolve(true),
              [ConfirmationModalWindowInputKeys.dismissHandlerFunction]: () => resolve(false),
              [ConfirmationModalWindowInputKeys.localStorageKey]: params.localStorageKey,
              [ConfirmationModalWindowInputKeys.dontShowTranslationKey]: params.dontShowTranslationKey
            },
          },
        ],
      });
    });
  }
}
