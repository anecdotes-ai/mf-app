import { Injectable } from '@angular/core';
import { AccountFeatureEnum } from 'core/modules/data/models/domain';
import { ModalWindowService } from 'core/modules/modals';
import { ExclusiveFeatureModalComponent } from '../../components/exclusive-feature-modal/exclusive-feature-modal.component';

@Injectable()
export class ExclusiveFeatureModalService {
  constructor(private modalWindowService: ModalWindowService) {}

  openExclusiveFeatureModal(feature: AccountFeatureEnum): void {
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'exclusive-feature-modal',
          componentType: ExclusiveFeatureModalComponent,
        },
      ],
      context: { feature }
    });
  }
}
