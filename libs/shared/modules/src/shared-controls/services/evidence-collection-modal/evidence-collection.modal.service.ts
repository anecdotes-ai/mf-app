import { Injectable } from '@angular/core';
import { LinkedFilesModalComponent } from '../../components/automation/linked-files';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceCreationModalParams, EvidenceUploadingParams } from '../../models';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { fromEvent } from 'rxjs';
import { EvidenceFacadeService } from 'core/modules/data/services';

@Injectable()
export class EvidenceCollectionModalService {
  constructor(private modalWindowService: ModalWindowService, private windowHelperService: WindowHelperService, private evidenceFacade: EvidenceFacadeService) {}

  /**
   * Opens modal for sharing link evidence
   * @param params contains information about appearence of modal and about target resource that the evidence will be linked to afterward.
   * If there is no target resource - evidence will be uploaded as a snadalone evidence and will appear only in evidence pool.
   */
  openSharedLinkEvidenceCreationModal(params: EvidenceCreationModalParams): void {
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'linked-files-modal',
          componentType: LinkedFilesModalComponent,
        },
      ],
      context: {
        ...params
      },
    });
  }

  /**
   * Opens file dialog and after a file is chosen uploads it as evidence.
   * @param params contains information about target resource that the evidence will be linked to afterward.
   * If there is no target resource - evidence will be uploaded as a snadalone evidence and will appear only in evidence pool.
   */
  openFileUploadingModal(params?: EvidenceUploadingParams): void {
    /*
      With the following hacks we don't even need evidence uploading components since all we need to do is to attach
      input with "file" type attribute to body and then remove it when file is chosen
    */

    const windowRef = this.windowHelperService.getWindow();
    const documentRef = windowRef.document;
    const bodyElement = documentRef.querySelector('body');
    const input: HTMLInputElement = documentRef.createElement('input');
    input.type = 'file';
    input.id = 'evidence-upload-file-input'; // this is used for automation tests
    input.style.display = 'none';
    const changeSubscription = fromEvent(input, 'change').subscribe((event: Event) => {
      const file = (event.target as HTMLInputElement).files[0];
      this.evidenceFacade.uploadEvidenceAsync(
        file,
        params.targetResource,
        params.frameworkId,
        params.controlId,
      );
      changeSubscription.unsubscribe();
    });
    const focusSubscription = fromEvent(windowRef, 'focus').subscribe(() => {
      input.remove();
      focusSubscription.unsubscribe();
    });
    bodyElement.appendChild(input);
    input.click();
  }
}
