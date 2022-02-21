import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isEmpty } from 'lodash';
import { Framework } from 'core/modules/data/models/domain';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { UserFacadeService } from 'core/modules/auth-core/services';
import { User } from 'core/modules/auth-core/models/domain';
import { Observable } from 'rxjs';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-framework-overview',
  templateUrl: './framework-overview.component.html',
  styleUrls: ['./framework-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkOverview implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  framework: Framework;
  auditors$: Observable<User[]>;

  constructor(
    private route: ActivatedRoute,
    private frameworksFacade: FrameworksFacadeService,
    private userFacade: UserFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const frameworkName = this.route?.parent?.snapshot?.paramMap?.get('framework');

    this.frameworksFacade
      .getFrameworkByName(frameworkName)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((framework) => {
        this.framework = framework;
        this.auditors$ = this.userFacade.getFrameworkAuditors(this.framework?.framework_id);

        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  hasAuditInfo(): boolean {
    return !isEmpty(this.framework?.framework_current_audit);
  }
}
