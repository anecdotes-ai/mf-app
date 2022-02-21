import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RegularDateFormatMMMdyyyy } from 'core/constants/date';
import { AuditLog } from 'core/modules/data/models/domain';
import { User } from 'core/modules/auth-core/models/domain';
import { LocalDatePipe } from 'core/modules/pipes';
import { SocTypes } from 'core/modules/shared-framework/constants';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { ExploreControlsSource } from 'core/models/user-events/user-event-data.model';

@Component({
  selector: 'app-audit-log-item',
  templateUrl: './audit-log-item.component.html',
  styleUrls: ['./audit-log-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LocalDatePipe],
})
export class AuditLogItem {
  @Input()
  auditLog: AuditLog;

  dateFormat: string = RegularDateFormatMMMdyyyy;
  auditorsMapping: any = {
    '=0': this.buildTranslationKey('InvitedAuditor.singular'),
    '=1': this.buildTranslationKey('InvitedAuditor.singular'),
    other: this.buildTranslationKey('InvitedAuditor.plural'),
  };

  constructor(private localDatePipe: LocalDatePipe, 
    private controlsNavigator: ControlsNavigator) {}

  buildTranslationKey(key: string): string {
    return `frameworks.frameworkManager.history.${key}`;
  }

  getAuditPeriodValue(): string {
    return this.auditLog.framework_fields?.type === SocTypes.type2
      ? `${this.localDatePipe.transform(
          this.auditLog?.framework_fields?.range_start,
          this.dateFormat
        )} - ${this.localDatePipe.transform(this.auditLog?.framework_fields?.range_end, this.dateFormat)}`
      : this.localDatePipe.transform(this.auditLog.audit_date, this.dateFormat);
  }

  getInvitedAuditorValue(): string | User | User[] {
    if (!this.auditLog?.auditors?.length) {
      return '-';
    } else if (this.auditLog?.auditors?.length > 1) {
      return this.auditLog.auditors;
    } else {
      return this.auditLog?.auditors[0] || '';
    }
  }

  async viewControls(): Promise<void> {
    await this.controlsNavigator.navigateToControlsAuditPageAsync(
      this.auditLog.framework_id,
      this.auditLog.snapshot_id,
      ExploreControlsSource.FrameworkAuditLog
    );
  }
}
