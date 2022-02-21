import { AddRequirementsSwitcherModals } from './../models/add-requirement-switcher-modals.constants';
import { EditRequirementModalEnum, RemoveRequirmentModalEnum } from '../../models';
import {
  RequirementEditModalComponent,
  translationRootKey,
} from '../../components/requirement-edit-modal/requirement-edit-modal.component';
import { AddRequirementSharedContextTranslationKey } from './../models/translation-key.constant';
import {
  StatusModalWindowInputKeys,
  StatusModalWindowSharedContext,
  StatusType,
  StatusWindowModalComponent,
  ConfirmationModalWindowComponent,
  ModalWindowService,
  ConfirmationModalWindowInputKeys
} from 'core/modules/modals';
import { Control, ControlRequirement, Framework } from 'core/modules/data/models/domain';
import { Injectable } from '@angular/core';
import { ModalWindowWithSwitcher } from 'core/models';
import { RequirementsFacadeService } from 'core/modules/data/services';
import { RequirementEditSharedContext } from './requirement-edit-shared-context';
import { RequirementCreationSharedContext } from './requirement-creation-shared-context';

@Injectable()
export class RequirementCustomizationModalService {
  constructor(
    private modalWindowService: ModalWindowService,
    private requirmentFacade: RequirementsFacadeService
    ) {}

  openAddRequirementModal(control_id: string, framework_id: string): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<RequirementCreationSharedContext> = {
      componentsToSwitch: AddRequirementsSwitcherModals,
      options: {
        closeOnBackgroundClick: false,
      },
      context: { control_id, framework_id, translationKey: AddRequirementSharedContextTranslationKey },
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }

  openEditRequirementModal(control: Control, requirement: ControlRequirement, framework: Framework): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<RequirementEditSharedContext> = {
      componentsToSwitch: [
        {
          id: EditRequirementModalEnum.MainModal,
          componentType: RequirementEditModalComponent,
        },
        {
          id: EditRequirementModalEnum.SuccessModal,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
          },
        },
        {
          id: EditRequirementModalEnum.ErrorModal,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
          },
        },
      ],
      context: { control, requirement, framework, translationKey: `${translationRootKey}.statusModal` },
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }

  openRemoveRequirmentConfirmationModal(control_id: string, framework_id: string, requirement: ControlRequirement): void{
    const rootConfirmationTranslationKey = 'requirements.requirmentRemoval.confirmationModal';
    const modalWindowSwitcher: ModalWindowWithSwitcher<StatusModalWindowSharedContext> = {
      componentsToSwitch: [
        {
          id: RemoveRequirmentModalEnum.remove,
          componentType: ConfirmationModalWindowComponent,
          contextData: {
            [ConfirmationModalWindowInputKeys.aftermathTemplate]: null,
            [ConfirmationModalWindowInputKeys.aftermathTranslationKey]: `${rootConfirmationTranslationKey}.aftermath`,
            [ConfirmationModalWindowInputKeys.confirmTranslationKey]: `${rootConfirmationTranslationKey}.yesRemove`,
            [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]:  () => this.requirmentFacade.removeRequirement(control_id, framework_id, requirement),
            [ConfirmationModalWindowInputKeys.dismissTranslationKey]: `${rootConfirmationTranslationKey}.cancel`,
            [ConfirmationModalWindowInputKeys.icon]: 'status_not_started',
            [ConfirmationModalWindowInputKeys.questionTranslationKey]: `${rootConfirmationTranslationKey}.question`,
            [ConfirmationModalWindowInputKeys.questionTranslationParams]: null,
            [ConfirmationModalWindowInputKeys.errorWindowSwitcherId]: RemoveRequirmentModalEnum.Error,
            [ConfirmationModalWindowInputKeys.successWindowSwitcherId]: RemoveRequirmentModalEnum.Success,
          },
        },
        {
          id: RemoveRequirmentModalEnum.Success,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
          },
        },
        {
          id: RemoveRequirmentModalEnum.Error,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
          },
        },
      ],
      context: {  translationKey: 'requirements.requirmentRemoval', [ConfirmationModalWindowInputKeys.aftermathTranslationKey]: `${rootConfirmationTranslationKey}.aftermath` },
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
