import { Injectable } from '@angular/core';
import { ModalWindowService } from 'core/modules/modals';
import { EvidencePreviewHostComponent } from 'core/modules/shared-controls/components/preview/evidence-preview-host/evidence-preview-host.component';

@Injectable({
  providedIn: 'root',
})
export class EvidencePreviewService {
  constructor(private modalWindowService: ModalWindowService) {}

  openEvidencePreviewModal(modalData: { [key: string]: string | boolean }): void {
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'evidence-preview-modal',
          componentType: EvidencePreviewHostComponent,
          contextData: modalData,
        },
      ],
    });
  }
}
