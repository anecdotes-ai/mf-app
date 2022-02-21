import { Injectable } from '@angular/core';
import { StatusWindowModalComponent } from 'core/modules/modals/components';
import {
  StatusModalWindowInputKeys,
  StatusType,
  CustomStatusModalButtons,
} from 'core/modules/modals/components/status-window-modal/constants';
import { ModalWindowService } from 'core/modules/modals/services';
import { Risk } from '../../models';
import { MitigateControlsModalComponent, MitigateControlsModalEnum } from '../../components';

@Injectable()
export class MitigateControlsModalService {
  constructor(private modalWindowService: ModalWindowService) {}

  openMitigateControlskModal(risk: Risk): void {
    const rootTranslationKey = 'riskManagement.mitigateControls.mitigateModal';

    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: MitigateControlsModalEnum.Link,
          componentType: MitigateControlsModalComponent,
        },
        {
          id: MitigateControlsModalEnum.Success,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
            [StatusModalWindowInputKeys.translationKey]: `${rootTranslationKey}.success`,
            [StatusModalWindowInputKeys.customButtons]: {
              mainButton: {
                id: 'link-more-btn',
                translationKeyPart: 'addMoreBtn',
                nextModalId: MitigateControlsModalEnum.Link,
              },
              secondaryButton: { id: 'got-it', translationKeyPart: 'gotItBtn' },
            } as CustomStatusModalButtons,
          },
        },
        {
          id: MitigateControlsModalEnum.Error,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
            [StatusModalWindowInputKeys.translationKey]: `${rootTranslationKey}.error`,
          },
        },
      ],
      context: { risk },
    });
  }
}
