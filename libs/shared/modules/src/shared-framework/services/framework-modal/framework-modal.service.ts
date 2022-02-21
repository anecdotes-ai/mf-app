import { Injectable } from '@angular/core';
import { GlobalLoaderModalComponent, GlobalLoaderModalWindowInputKeys, ModalWindowService, StatusType, StatusWindowModalComponent } from 'core/modules/modals';
import { Framework } from 'core/modules/data/models/domain';
import { ModalWindowWithSwitcher } from 'core/models/modal-window.model';
import { FreezeFrameworksModalComponent } from '../../components';
import { CustomStatusModalButtons, StatusModalWindowInputKeys } from 'core/modules/modals/components/status-window-modal/constants';
import { FrozenItemModalEnum } from '../../constants';

export interface FrozenFrameworkInputs {
  id: string;
  frameworksList: Framework[];
}

@Injectable()
export class FrameworkModalService {

  constructor(private modalWindowService: ModalWindowService) { }

  openFrozenFrameworksModal(): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<FrozenFrameworkInputs> = {
      componentsToSwitch: [
        {
          id: FrozenItemModalEnum.Frozen,
          componentType: FreezeFrameworksModalComponent
        },
        {
          id: FrozenItemModalEnum.Loader,
          componentType: GlobalLoaderModalComponent,
          contextData: {
            [GlobalLoaderModalWindowInputKeys.description]: 'frameworks.freeze-modal.loading-description',
            [GlobalLoaderModalWindowInputKeys.successWindowSwitcherId]: FrozenItemModalEnum.Success,
            [GlobalLoaderModalWindowInputKeys.errorWindowSwitcherId]: FrozenItemModalEnum.Error
          }
        },
        {
          id: FrozenItemModalEnum.Success,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
            [StatusModalWindowInputKeys.translationKey]: 'frameworks.freeze-modal.success',
          },
        },
        {
          id: FrozenItemModalEnum.Error,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
            [StatusModalWindowInputKeys.translationKey]: 'frameworks.freeze-modal.error',
            [StatusModalWindowInputKeys.customButtons]: {
              mainButton: {
                id: 'try-again',
                translationKeyPart: 'btn',
                nextModalId: FrozenItemModalEnum.Frozen,
              }
            } as CustomStatusModalButtons,
          },
        },
      ],
      options: { closeBtnDisplay: false },
    };
    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
