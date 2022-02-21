import { Injectable } from '@angular/core';
import { StatusWindowModalComponent } from 'core/modules/modals/components';
import {
  StatusModalWindowInputKeys,
  StatusType,
  CustomStatusModalButtons,
} from 'core/modules/modals/components/status-window-modal/constants';
import { ModalWindowService } from 'core/modules/modals/services';
import { RiskCategory, RiskSource } from '../../models';
import { AddRiskModalComponent, AddRiskModalEnum } from '../../components';

@Injectable()
export class AddRiskModalService {
  constructor(private modalWindowService: ModalWindowService) {}

  openAddRiskModal(riskCategories: RiskCategory[], riskSources: RiskSource[]): void {
    const rootTranslationKey = 'riskManagement.addRiskModal';

    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: AddRiskModalEnum.Add,
          componentType: AddRiskModalComponent,
          contextData: {
            riskCategories,
            riskSources,
          },
        },
        {
          id: AddRiskModalEnum.Success,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
            [StatusModalWindowInputKeys.translationKey]: `${rootTranslationKey}.success`,
            [StatusModalWindowInputKeys.customButtons]: {
              mainButton: {
                id: 'add-more-risk-btn',
                translationKeyPart: 'addMoreBtn',
                nextModalId: AddRiskModalEnum.Add,
              },
              secondaryButton: { id: 'got-it', translationKeyPart: 'gotItBtn' },
            } as CustomStatusModalButtons,
          },
        },
        {
          id: AddRiskModalEnum.Error,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
            [StatusModalWindowInputKeys.translationKey]: `${rootTranslationKey}.error`,
          },
        },
      ],
    });
  }
}
