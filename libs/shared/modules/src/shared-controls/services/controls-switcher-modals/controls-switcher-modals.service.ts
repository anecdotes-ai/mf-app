import { ControlGuidelineModalWindowInputKeys } from './../../components/control-guideline/constants/control-guideline.constants';
import { CalculatedControl } from './../../../data/models/calculated-control.model';
import { Framework } from 'core/modules/data/models/domain';
import { ControlGuidelineComponent } from 'core/modules/shared-controls/components';
import { GuidelineModalIdsEnum } from './../../models/guideline-modal-ids';
import { ModalWindowService } from './../../../modals/services/modal-window/modal-window.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ControlsSwitcherModalsService {
  constructor(private modalWindowService: ModalWindowService) {}

  openGuidelineModal(control: CalculatedControl, framework: Framework): void {
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: GuidelineModalIdsEnum.MainWindowId,
          componentType: ControlGuidelineComponent,
          contextData: {
            [ControlGuidelineModalWindowInputKeys.control]: control,
            [ControlGuidelineModalWindowInputKeys.framework]: framework,
          },
        },
      ],
      options: { closeBtnDisplay: false, displayBackground: false },
    });
  }
}
