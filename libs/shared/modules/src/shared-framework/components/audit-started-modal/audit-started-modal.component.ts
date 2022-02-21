import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-audit-started-modal',
    templateUrl: './audit-started-modal.component.html',
    styleUrls: ['./audit-started-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditStartedModal {
    @Input('frameworkIcon')
    frameworkIcon: string;

    @Input('closeModal')
    closeModal: () => void;

    buildTranslationKey(relativeKey: string): string {
        return `frameworks.frameworkManager.auditStartedModal.${relativeKey}`;
    }
}
