import { Injectable } from '@angular/core';
import { StatusWindowModalComponent } from 'core/modules/modals/components';
import { StatusModalWindowInputKeys, StatusType } from 'core/modules/modals/components/status-window-modal/constants';
import { ModalWindowService } from 'core/modules/modals/services';
import { Framework } from 'core/modules/data/models/domain';
import { EndAuditModal, EndAuditModalEnum } from '../../components';

@Injectable()
export class EndAuditModalService {
  constructor(private modalWindowService: ModalWindowService) {}

  openEndAuditModal(framework: Framework, onAuditEnded: (boolean) => Promise<void>): void {
    const rootTranslationKey = 'frameworks.frameworkManager.endAuditModal';

    this.modalWindowService.openInSwitcher({
        componentsToSwitch: [
            {
                id: EndAuditModalEnum.EndAudit,
                componentType: EndAuditModal,
                contextData: {
                    framework,
                    onAuditEnded
                },
            },
            {
                id: EndAuditModalEnum.Success,
                componentType: StatusWindowModalComponent,
                contextData: {
                    [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
                    [StatusModalWindowInputKeys.closeModalOnClick]: true,
                    [StatusModalWindowInputKeys.translationKey]: `${rootTranslationKey}.success`
                },
            },
            {
                id: EndAuditModalEnum.Error,
                componentType: StatusWindowModalComponent,
                contextData: {
                    [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
                    [StatusModalWindowInputKeys.closeModalOnClick]: true,
                    [StatusModalWindowInputKeys.translationKey]: `${rootTranslationKey}.error`,
                },
            },
        ],
    });
  }
}
