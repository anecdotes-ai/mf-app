import { Injectable } from '@angular/core';
import {
  ConfirmationModalWindowComponent,
  ConfirmationModalWindowInputKeys,
  ModalWindowService,
  StatusWindowModalComponent,
  StatusModalWindowInputKeys,
  StatusType,
} from 'core/modules/modals';
import { ModalWindowWithSwitcher } from 'core/models';
import { RemoveItemModalEnum } from '../../models';
import { ItemSharedContext } from '../../models/item-shared-context.model';
import { EditItemSwitherModels } from '../constants';
import { AddExistingWithItemsSwitcherModals } from '../constants/add-item-with-existing-switcher-modals.constants';




@Injectable()
export class CustomizationModalService {
  constructor(private modalWindowService: ModalWindowService) { }

  openAddPolicyModal(context: ItemSharedContext): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<ItemSharedContext> = {
      componentsToSwitch: AddExistingWithItemsSwitcherModals,
      options: {
        closeOnBackgroundClick: false,
      },
      context: context,
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }

  openEditPolicyModal(context: ItemSharedContext): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<ItemSharedContext> = {
      componentsToSwitch: EditItemSwitherModels,
      context: context,
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }

  openRemoveItemConfirmation(translationKey: string, confirmationFunc: () => Promise<void>): void {
    const removeModalTranslationKey = `${translationKey}.removeModal`;

    const modalWindowSwitcher = {
      componentsToSwitch: [
        {
          id: RemoveItemModalEnum.Remove,
          componentType: ConfirmationModalWindowComponent,
          contextData: {
            [ConfirmationModalWindowInputKeys.aftermathTemplate]: null,
            [ConfirmationModalWindowInputKeys.aftermathTranslationKey]: `${removeModalTranslationKey}.aftermath`,
            [ConfirmationModalWindowInputKeys.confirmTranslationKey]: `${removeModalTranslationKey}.yesRemove`,
            [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]: confirmationFunc,
            [ConfirmationModalWindowInputKeys.dismissTranslationKey]: `${removeModalTranslationKey}.cancel`,
            [ConfirmationModalWindowInputKeys.icon]: 'status_not_started',
            [ConfirmationModalWindowInputKeys.questionTranslationKey]: `${removeModalTranslationKey}.question`,
            [ConfirmationModalWindowInputKeys.questionTranslationParams]: null,
            [ConfirmationModalWindowInputKeys.successWindowSwitcherId]: RemoveItemModalEnum.Success,
            [ConfirmationModalWindowInputKeys.errorWindowSwitcherId]: RemoveItemModalEnum.Error,
          },
        },
        {
          id: RemoveItemModalEnum.Success,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
          },
        },
        {
          id: RemoveItemModalEnum.Error,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
          },
        },
      ],
      context: {
        translationKey: removeModalTranslationKey
      },
      options: { closeOnBackgroundClick: false },
    };
    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
