import { Injectable } from '@angular/core';
import { StatusWindowModalComponent } from 'core/modules/modals/components';
import { StatusModalWindowInputKeys, StatusType } from 'core/modules/modals/components/status-window-modal/constants';
import { ModalWindowService } from 'core/modules/modals/services';
import { Audit, Framework } from 'core/modules/data/models/domain';
import { ConfigureAuditModalComponent, ConfigureAuditModalEnum } from '../../components';

@Injectable()
export class ConfigureAuditModalService {
  constructor(private modalWindowService: ModalWindowService) {}

  openConfigureAuditModal(framework: Framework, action: (framework_id: string, audit: Audit) => Promise<void>): void {
    const rootTranslationKey = 'frameworks.frameworkManager.overview.configureAuditModal';

    this.modalWindowService.openInSwitcher({
        componentsToSwitch: [
            {
                id: ConfigureAuditModalEnum.Configure,
                componentType: ConfigureAuditModalComponent,
                contextData: {
                    framework: framework,
                    action
                },
            },
            {
                id: ConfigureAuditModalEnum.Success,
                componentType: StatusWindowModalComponent,
                contextData: {
                    [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
                    [StatusModalWindowInputKeys.closeModalOnClick]: true,
                    [StatusModalWindowInputKeys.translationKey]: `${rootTranslationKey}.success`,
                },
            },
            {
                id: ConfigureAuditModalEnum.Error,
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
