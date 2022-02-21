import { Injectable } from '@angular/core';
import { ModalWindowWithSwitcher } from 'core/models/modal-window.model';
import { FrameworksPluginsListComponent } from '../../components/frameworks-plugins-list/frameworks-plugins-list.component';
import { FrameworksPluginsModalIds } from 'core/modules/shared-controls/modules/frameworks-plugins/models/frameworks-plugins-modal-ids';
import {
  ModalWindowService,
  StatusModalWindowInputKeys,
  StatusType,
  StatusWindowModalComponent,
} from 'core/modules/modals';

export interface FrameworksPluginsListInputs {
  frameworkId: string;
}

@Injectable({
  providedIn: 'root',
})
export class FrameworksPluginsModalService {
  constructor(private modalWindowService: ModalWindowService) {}

  openFrameworksPluginsList(frameworkId: string): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher = {
      componentsToSwitch: [
        {
          id: FrameworksPluginsModalIds.FrameworksPluginsList,
          componentType: FrameworksPluginsListComponent,
          contextData: {
            frameworkId: frameworkId,
          } as FrameworksPluginsListInputs,
        },
        {
          id: FrameworksPluginsModalIds.Success,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
            [StatusModalWindowInputKeys.translationKey]: 'frameworksPlugins.success',
          },
        },
        {
          id: FrameworksPluginsModalIds.Error,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
            [StatusModalWindowInputKeys.translationKey]: 'frameworksPlugins.error',
          },
        },
      ],
      context: {
        translationKey: 'frameworksPlugins',
      },
    };
    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
