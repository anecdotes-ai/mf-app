import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppRoutes, ExploreControlsSource } from 'core';
import { Framework } from 'core/modules/data/models/domain';
import { FrameworkService, FrameworksFacadeService } from 'core/modules/data/services';
import { RoleService } from 'core/modules/auth-core/services';
import { TabModel } from 'core/modules/dropdown-menu';
import { ModalWindowService } from 'core/modules/modals';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { EndAuditModalService } from 'core/modules/shared-framework';
import { AuditStartedModalService } from 'core/services';
import { isDateBeforeToday, SubscriptionDetacher } from 'core/utils';

const HISTORY_TAB_ID = 1;
@Component({
  selector: 'app-framework-manager',
  templateUrl: './framework-manager.component.html',
  styleUrls: ['./framework-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkManager implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @ViewChild('auditStartedModal', { static: true })
  private auditStartedModalTemplate: TemplateRef<any>;

  framework: Framework;
  tabs: TabModel[] = [];
  isAuditInProgress: boolean;
  selectedTabId = 0;
  isAuditor: boolean;

  constructor(
    private route: ActivatedRoute,
    private frameworksFacade: FrameworksFacadeService,
    private frameworkService: FrameworkService,
    private cd: ChangeDetectorRef,
    private modalWindowService: ModalWindowService,
    private controlsNavigator: ControlsNavigator,
    private auditStartedModalService: AuditStartedModalService,
    private endAuditModalService: EndAuditModalService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    const frameworkName = this.route?.snapshot?.paramMap?.get('framework');

    this.tabs = [this.getOverviewTab(frameworkName)];

    this.roleService
      .isAuditor()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((isAuditor) => (this.isAuditor = isAuditor));

    this.frameworksFacade
      .getFrameworkByName(frameworkName)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((framework) => {
        this.framework = framework ?? this.framework;
        this.frameworksFacade
          .getFrameworkAuditHistory(framework.framework_id)
          .pipe(this.detacher.takeUntilDetach())
          .subscribe((logs) => {
            if (!logs) {
              this.frameworksFacade.loadFrameworkAuditHistory(framework.framework_id);
            } else {
              this.tabs = !!logs.length
                ? [this.getOverviewTab(frameworkName), this.getHistoryTab(frameworkName)]
                : [this.getOverviewTab(frameworkName)];

              this.cd.detectChanges();
            }
          });

        this.isAuditInProgress = isDateBeforeToday(this.framework?.framework_current_audit?.audit_date);

        if (
          !this.isAuditor &&
          this.isAuditInProgress &&
          this.auditStartedModalService.shouldModalBeOpen(frameworkName)
        ) {
          this.auditStartedModalService.openAuditStartedModal(frameworkName, this.auditStartedModalTemplate);
        }

        this.cd.detectChanges();
      });
  }

  closeAuditStartedModal = (): void => {
    this.auditStartedModalService.setModalDisplayed(this.framework.framework_name);
    this.modalWindowService.close();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  getCurrentFrameworkIcon(): string {
    if (this.framework) {
      return this.frameworkService.getFrameworkIconLink(
        this.framework.framework_icon_id ?? this.framework.framework_id
      );
    }
  }

  exploreControls(event: MouseEvent): void {
    event.stopPropagation();
    this.controlsNavigator.navigateToControlsPageAsync(
      this.framework.framework_id,
      null,
      ExploreControlsSource.FrameworkManager
    );
  }

  endAudit(event: MouseEvent): void {
    event.stopPropagation();
    this.endAuditModalService.openEndAuditModal(this.framework, this.onAuditEnded.bind(this));
  }

  onAuditEnded(shouldChangeTab: boolean): void {
    if (shouldChangeTab) {
      this.selectedTabId = HISTORY_TAB_ID;
      this.cd.detectChanges();
    }
  }

  buildTranslationKey(key: string): string {
    return `frameworks.frameworkManager.${key}`;
  }

  private getOverviewTab(frameworkName: string): TabModel {
    return {
      tabId: 0,
      routerLink: `/${AppRoutes.Frameworks}/${frameworkName}/${AppRoutes.FrameworkOverview}`,
      translationKey: this.buildTranslationKey('overview.tab'),
    };
  }

  private getHistoryTab(frameworkName: string): TabModel {
    return {
      tabId: HISTORY_TAB_ID,
      routerLink: `/${AppRoutes.Frameworks}/${frameworkName}/${AppRoutes.FrameworkAuditHistory}`,
      translationKey: this.buildTranslationKey('history.tab'),
    };
  }
}
