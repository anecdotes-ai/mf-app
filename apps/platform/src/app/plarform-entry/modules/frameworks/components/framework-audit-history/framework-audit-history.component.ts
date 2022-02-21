import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditLog, Framework } from 'core/modules/data/models/domain';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-framework-audit-history',
  templateUrl: './framework-audit-history.component.html',
  styleUrls: ['./framework-audit-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkAuditHistory implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  framework: Framework;
  auditHistoryLogs: AuditLog[];

  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private frameworksFacade: FrameworksFacadeService
  ) {}

  ngOnInit(): void {
    const frameworkName = this.route?.parent?.snapshot?.paramMap?.get('framework');

    this.frameworksFacade
      .getFrameworkByName(frameworkName)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((framework) => {
        this.framework = framework;

        this.frameworksFacade
          .getFrameworkAuditHistory(framework.framework_id)
          .pipe(this.detacher.takeUntilDetach())
          .subscribe((logs) => {
            this.auditHistoryLogs = logs;
            this.cd.detectChanges();
          });
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }
}
