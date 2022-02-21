import { Injectable } from '@angular/core';
import { ModalWindowService, StatusType, StatusWindowModalComponent } from 'core/modules/modals';
import { ModalWindowWithSwitcher } from 'core/models/modal-window.model';
import { EvidenceConnectComponent, EvidenceInfoComponent, EvidenceListComponent } from '../../components';
import { CalculatedControl, EvidenceLike } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { RequirementLike } from 'core/modules/shared-controls/models';
import { EvidenceModalIds } from '../../models';
import {
  CustomStatusModalButtons,
  StatusModalWindowInputKeys,
} from 'core/modules/modals/components/status-window-modal/constants';

export interface EvidencePoolItemInputs {
  id: string;
  control?: CalculatedControl;
  requirementLike?: RequirementLike;
  evidenceLike?: EvidenceLike;
  isFullViewMode?: boolean;
}

export interface EvidencePoolInputs {
  requirementLike: RequirementLike;
  framework: Framework;
  controlInstance: CalculatedControl;
}

export interface EvidencePoolItemConnectInputs {
  evidenceLike?: EvidenceLike;
}

@Injectable()
export class EvidenceModalService {
  constructor(private modalWindowService: ModalWindowService) {}

  openEvidenceInfoModal(
    control: CalculatedControl,
    requirementLike: RequirementLike,
    evidenceLike: EvidenceLike
  ): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<EvidencePoolItemInputs> = {
      componentsToSwitch: [
        {
          id: 'openEvidenceInfoModal',
          componentType: EvidenceInfoComponent,
          contextData: {
            control: control,
            requirementLike: requirementLike,
            evidenceLike: evidenceLike,
            isFullViewMode: true,
          } as EvidencePoolItemInputs,
        },
      ],
    };
    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }

  openEvidenceListComponent(requirement: RequirementLike, framework: Framework, controlInstance: CalculatedControl): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher = {
      componentsToSwitch: [
        {
          id: EvidenceModalIds.EvidenceList,
          componentType: EvidenceListComponent,
          contextData: {
            requirementLike: requirement,
            framework: framework,
            controlInstance: controlInstance
          } as EvidencePoolInputs,
        },
        {
          id: EvidenceModalIds.Success,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
            [StatusModalWindowInputKeys.translationKey]: 'connectEvidenceModal.success',
            [StatusModalWindowInputKeys.customButtons]: {
              mainButton: {
                id: 'add-more-evidence-btn',
                translationKeyPart: 'addMoreEvidenceBtn',
                nextModalId: EvidenceModalIds.EvidenceList,
              },
              secondaryButton: { id: 'got-it', translationKeyPart: 'gotItBtn' },
            } as CustomStatusModalButtons,
          },
        },
        {
          id: EvidenceModalIds.Error,
          componentType: StatusWindowModalComponent,
          contextData: {
            statusType: StatusType.ERROR,
            translationKey: 'connectEvidenceModal.error',
            closeModalOnClick: false,
          },
        },
      ],
      context: {
        translationKey: 'connectEvidenceModal',
      },
      options: { closeOnBackgroundClick: false },
    };
    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }

  openEvidenceConnectComponent(evidenceLike: EvidenceLike): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<EvidencePoolItemConnectInputs> = {
      componentsToSwitch: [
        {
          id: 'openEvidenceConnectComponent',
          componentType: EvidenceConnectComponent,
          contextData: {
            evidenceLike: evidenceLike,
          } as EvidencePoolItemConnectInputs,
        },
      ],
    };
    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
