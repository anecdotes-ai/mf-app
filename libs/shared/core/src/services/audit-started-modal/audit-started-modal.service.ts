import { Injectable, TemplateRef } from '@angular/core';
import { ModalWindowService } from 'core/modules/modals/services';
import { AUDIT_STARTED_MODAL } from 'core/modules/shared-framework/constants/localstorageKeys.constants';
import { WindowHelperService } from '../window-helper/window-helper.service';

@Injectable(
    // TODO: Must be removed. Currently cannot be removed since it breaks lots of tests
    {
      providedIn: 'root' 
    }
)
export class AuditStartedModalService {
    private localStorage: Storage;

    constructor(private modalWindowService: ModalWindowService,
        private windowHelper: WindowHelperService) {
        this.localStorage = this.windowHelper.getWindow()?.localStorage;
    }

    shouldModalBeOpen(frameworkName: string): boolean {
        return !JSON.parse(this.localStorage?.getItem(`${AUDIT_STARTED_MODAL}${frameworkName}`));
    }

    openAuditStartedModal(frameworkName: string, template: TemplateRef<any>): void {
        this.modalWindowService.open({
            template,
            options: { onClose: this.setModalDisplayed.bind(this, frameworkName) }
        });
    }

    setModalForOpening(frameworkName: string) : void {
        this.localStorage.setItem(`${AUDIT_STARTED_MODAL}${frameworkName}`, "false");
    }

    setModalDisplayed(frameworkName: string) : void {
        this.localStorage.setItem(`${AUDIT_STARTED_MODAL}${frameworkName}`, "true");
    }
}
