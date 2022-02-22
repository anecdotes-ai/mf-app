import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes, InviteUserSource } from 'core';
import { RegularDateFormatMMMdyyyy } from 'core/constants/date';
import { RoleEnum, User } from 'core/modules/auth-core/models/domain';
import { LocalDatePipe } from 'core/modules/pipes';
import { Audit, Framework } from 'core/modules/data/models/domain';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { MenuAction } from 'core/modules/dropdown-menu/types';
import { InviteUserModalService } from 'core/modules/invite-user';
import { ConfigureAuditModalService } from 'core/modules/shared-framework/services';
import { isEmpty } from 'lodash';

@Component({
    selector: 'app-framework-audit-info',
    templateUrl: './framework-audit-info.component.html',
    styleUrls: ['./framework-audit-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        LocalDatePipe
    ],
})
export class FrameworkAuditInfo implements OnInit, OnChanges {
    @Input()
    framework: Framework;
    @Input()
    auditors: User[] = [];

    audit: Audit;
    threeDotsMenu: MenuAction[] = [];
    dateRangeFormat = 'MMM d, yy';
    dateFormat: string = RegularDateFormatMMMdyyyy;
    auditorsMapping: any = {
        '=1': this.buildTranslationKey('auditors.singular'),
        'other': this.buildTranslationKey('auditors.plural')
    }
    isLoading = false;

    constructor(
        private localDatePipe: LocalDatePipe,
        private inviteUserModalService: InviteUserModalService,
        private configureAuditModalService: ConfigureAuditModalService,
        private frameworksFacade: FrameworksFacadeService,
        private router: Router,
        private cd: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.setAudit();
        this.initThreeDotMenu();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('framework' in changes) {
            this.setAudit();
        }
    }

    buildTranslationKey(key: string): string {
        return `frameworks.frameworkManager.overview.${key}`;
    }

    getAssignedAuditorValue(): any {
        if (!this.auditors.length && this.audit) {
            return this.buildTranslationKey('notInvited');
        } else if (this.auditors.length > 1) {
            return this.auditors;
        } else {
            return this.auditors[0] ? `${this.auditors[0].first_name} ${this.auditors[0].last_name}` : '';
        }
    }

    getDateRangeValue(): string {
        return `${this.localDatePipe.transform(this.audit?.framework_fields?.range_start, this.dateRangeFormat)} - ${this.localDatePipe.transform(this.audit?.framework_fields?.range_end, this.dateRangeFormat)}`;
    }

    inviteAuditor(): void {
        this.inviteUserModalService.openInviteUserModal(InviteUserSource.FrameworkManager, RoleEnum.Auditor, null ,this.framework);
    }

    setupAudit(): void {
        this.configureAuditModalService.openConfigureAuditModal(this.framework, this.frameworksFacade.setFrameworkAudit.bind(this.frameworksFacade));
    }

    private setAudit(): void {
        this.audit = isEmpty(this.framework?.framework_current_audit) ? null : this.framework?.framework_current_audit;
    }

    private async resetAudit(): Promise<void> {
        this.isLoading = true;
        this.cd.detectChanges();
        try {
            await this.frameworksFacade.deleteFrameworkAudit(this.framework);
        } finally {
            this.isLoading = false;
            this.cd.detectChanges();
        }
    }

    private initThreeDotMenu(): void {
        this.threeDotsMenu = [
            {
                translationKey: this.buildTranslationKey('inviteAuditor'),
                displayCondition: () => !!this.auditors.length,
                action: () => this.inviteAuditor(),
            },
            {
                translationKey: this.buildTranslationKey('editAudit'),
                displayCondition: () => !!this.audit,
                action: () =>
                    this.configureAuditModalService.openConfigureAuditModal(this.framework, this.frameworksFacade.updateFrameworkAudit.bind(this.frameworksFacade))
            },
            {
                translationKey: this.buildTranslationKey('resetAudit'),
                displayCondition: () => !!this.audit,
                action: () => this.resetAudit(),
            },
            {
                translationKey: this.buildTranslationKey('manageAuditor'),
                displayCondition: () => !!this.auditors.length,
                action: () => this.router.navigate([`/${AppRoutes.Settings}/${AppRoutes.UserManagement}`]),
            },
        ];
    }
}
