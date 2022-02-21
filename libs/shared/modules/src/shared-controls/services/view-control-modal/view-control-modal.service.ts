import { Injectable } from '@angular/core';
import { ModalWindowWithSwitcher } from 'core/models/modal-window.model';
import { ModalWindowService } from 'core/modules/modals/services';
import { ViewControlModal } from '../../components';
import { ControlPreviewModalParams } from 'core/modules/shared-controls/models';



@Injectable()
export class ViewControlModalService {
  constructor(private modalWindowService: ModalWindowService) {}

  openViewControlModal(controlId: string, context: ControlPreviewModalParams): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher = {
      componentsToSwitch: [
        {
          id: 'viewControlModal',
          componentType: ViewControlModal,
          contextData: {
            controlId,
          },
        },
      ],
      context: context,
    };
    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
