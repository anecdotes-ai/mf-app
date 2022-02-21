import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserStatus } from 'core/models/user-status';
import { User } from 'core/modules/auth-core/models/domain';

const MAX_AUDITORS = 4;

@Component({
    selector: 'app-auditor-list',
    templateUrl: './auditor-list.component.html',
    styleUrls: ['./auditor-list.component.scss'],
})
export class AuditorListComponent implements OnChanges {
    @Input()
    auditors: User[];

    auditorsToDisplay: User[];
    invitationStatus = UserStatus;
    moreAuditors: string[];

    ngOnChanges(changes: SimpleChanges): void {
        if ('auditors' in changes) {
            this.getAuditorsToDisplay();
        }
    }

    getAuditorsToDisplay(): void {
        // Take only first 4 auditors
        if (this.auditors?.length > MAX_AUDITORS) {
            this.auditorsToDisplay = this.auditors.slice(0, MAX_AUDITORS);

            this.moreAuditors = this.auditors.slice(MAX_AUDITORS)
                .map(auditor => `${auditor.first_name} ${auditor.last_name}`);

        } else {
            this.auditorsToDisplay = this.auditors;
        }
    }

    trackByFn(index: number, obj: any): any {
        return obj ? obj.uid : index;
    }
}
