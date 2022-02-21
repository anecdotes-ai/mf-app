import { AddRequirementModalEnum } from './../../../requirement/models/modal-ids.constants';
import { AddRequirementsSwitcherModals } from './../../../requirement/services/models/add-requirement-switcher-modals.constants';
import { CustomStatusModalButtons } from 'core/modules/modals/components';
import {
  StatusModalWindowInputKeys,
  StatusModalWindowSharedContext,
  StatusType,
} from 'core/modules/modals/components/status-window-modal/constants';
import { StatusWindowModalComponent, ModalWindowService, ConfirmationModalWindowComponent, ConfirmationModalWindowInputKeys } from 'core/modules/modals';
import { AddCustomControlModalEnum, EditCustomControlModalEnum } from './../../models';
import {  } from 'core/components';
import { RemoveCustomControlModalEnum } from './../../models/modal-ids.constants';
import {
  ControlCustomizationComponent,
  translationRootKey,
} from './../../components/control-customization/control-customization.component';
import { Injectable } from '@angular/core';
import { ModalWindowWithSwitcher } from 'core/models/modal-window.model';
import { ControlsFacadeService } from 'core/modules/data/services';
import { ControlCustomizationSharedContext } from './controls-customization-shared-context';

@Injectable({
  providedIn: 'root',
})
export class ControlsCustomizationModalService {
  constructor(
    private modalWindowService: ModalWindowService,
    private controlsFacade: ControlsFacadeService
  ) { }

  openAddCustomControlModal(framework_id: string): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<ControlCustomizationSharedContext> = {
      componentsToSwitch: [
        {
          id: AddCustomControlModalEnum.AddNew,
          componentType: ControlCustomizationComponent,
        },
        {
          id: AddCustomControlModalEnum.Success,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
            [StatusModalWindowInputKeys.customButtons]: {
              mainButton: {
                id: 'add-requirement-btn',
                translationKeyPart: 'buttons.addRequirement',
                nextModalId: AddRequirementModalEnum.SelectExisting,
              },
              secondaryButton: { id: 'not-now-btn', translationKeyPart: 'buttons.notNow' },
            } as CustomStatusModalButtons,
          },
        },
        {
          id: AddCustomControlModalEnum.Error,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
          },
        },
        ...AddRequirementsSwitcherModals,
      ],
      context: { framework_id, translationKey: `${translationRootKey}.addResultModals` },
      options: { closeOnBackgroundClick: false },
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }

  openEditCustomControlModal(framework_id: string, control_id: string): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<ControlCustomizationSharedContext> = {
      componentsToSwitch: [
        {
          id: EditCustomControlModalEnum.MainModal,
          componentType: ControlCustomizationComponent,
        },
        {
          id: EditCustomControlModalEnum.SuccessModal,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
          },
        },
        {
          id: EditCustomControlModalEnum.ErrorModal,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
          },
        },
      ],
      context: { control_id, isEditMode: true, framework_id, translationKey: `${translationRootKey}.editResultModals` },
      options: { closeOnBackgroundClick: false },
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }

  openRemoveCustomControlConfirmation(control_id: string): void {
    const rootConfirmationTranslationKey = 'controls.controlRemoval.confirmationModal';

    const modalWindowSwitcher: ModalWindowWithSwitcher<StatusModalWindowSharedContext> = {
      componentsToSwitch: [
        {
          id: RemoveCustomControlModalEnum.Remove,
          componentType: ConfirmationModalWindowComponent,
          contextData: {
            [ConfirmationModalWindowInputKeys.aftermathTemplate]: null,
            [ConfirmationModalWindowInputKeys.aftermathTranslationKey]: `${rootConfirmationTranslationKey}.aftermath`,
            [ConfirmationModalWindowInputKeys.confirmTranslationKey]: `${rootConfirmationTranslationKey}.yesRemove`,
            [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]: () => this.controlsFacade.removeCustomControl(control_id),
            [ConfirmationModalWindowInputKeys.dismissTranslationKey]: `${rootConfirmationTranslationKey}.cancel`,
            [ConfirmationModalWindowInputKeys.icon]: 'status_not_started',
            [ConfirmationModalWindowInputKeys.questionTranslationKey]: `${rootConfirmationTranslationKey}.question`,
            [ConfirmationModalWindowInputKeys.questionTranslationParams]: null,
            [ConfirmationModalWindowInputKeys.successWindowSwitcherId]: RemoveCustomControlModalEnum.Success,
            [ConfirmationModalWindowInputKeys.errorWindowSwitcherId]: RemoveCustomControlModalEnum.Error,
          },
        },
        {
          id: RemoveCustomControlModalEnum.Success,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
          },
        },
        {
          id: RemoveCustomControlModalEnum.Error,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
          },
        },
      ],
      context: {
        translationKey: 'controls.controlRemoval'
      },
      options: { closeOnBackgroundClick: false },
    };
    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }

  openRemoveCustomControlSuccess(translationKey: string): void {
    this.modalWindowService.openSuccessAlert(translationKey);
  }
}
