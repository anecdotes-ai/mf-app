import { FrameworksFacadeService, ControlsFacadeService } from 'core/modules/data/services/facades';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'core/constants';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { RoleService } from 'core/modules/auth-core/services/role/role.service';
import { FrameworkStatus, CalculatedControl } from 'core/modules/data/models';
import { AccountFeatureEnum, Framework } from 'core/modules/data/models/domain';
import { FrameworkService } from 'core/modules/data/services';
import { MenuAction } from 'core/modules/dropdown-menu';
import { SubscriptionDetacher, isDateBeforeToday } from 'core/utils';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FrameworkContentRow } from '../../models/framework-content-row.model';
import { FrameworkContentService } from '../../services/index';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { ExploreControlsSource } from 'core/models';

export enum ApplicabilityRequestTypes {
  Abandon = 0,
  Adopt = 1,
}

@Component({
  selector: 'app-framework-item',
  templateUrl: './framework-item.component.html',
  styleUrls: ['./framework-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkItemComponent implements OnChanges, OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  frameworkStatus = FrameworkStatus;

  @HostBinding('class')
  private readonly classes = 'bg-white flex flex-column';

  @HostBinding('class.applicable')
  private get isApplicable(): boolean {
    return this.framework.is_applicable;
  }

  @HostBinding('class.in-audit')
  private get isInAudit(): boolean {
    return this.inAudit && this.framework.is_applicable;
  }

    // TODO: Replace with navigator
    @HostListener('click')
    exploreControls(filterBy?: { key: string; value: any; }): void {
      if (!this.framework.is_applicable) {
        return;
      }
  
      const filter = {};
  
      if (filterBy.key === 'automation') {
        filter['plugins'] = 'All_plugins';
      } else {
        filter[filterBy.key] = filterBy.value;
      }
  
      this.controlsNavigator.navigateToControlsPageAsync(
        this.framework.framework_id,
        filter,
        ExploreControlsSource.FrameworksPage
      );
    }
  
    @HostListener('click')
    private onClick(): void {
      if (!this.framework.is_applicable) {
        return;
      }
  
      this.router.navigate([`/${AppRoutes.Frameworks}/${this.framework.framework_name}/${AppRoutes.FrameworkOverview}`]);
    }
  

  readonly visibleForRoles: string[] = [RoleEnum.Admin, RoleEnum.Collaborator];

  features = AccountFeatureEnum;

  scrollbarConfig: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
  };

  @Input()
  framework: Framework;

  threeDotsMenu: MenuAction<Framework>[];
  contentRowsToDisplay: FrameworkContentRow[] = [];
  contentLoader: boolean;
  inAudit = false;
  currentUsersRole: RoleEnum;
  controls: CalculatedControl[];

  @HostBinding('class.coming-soon')
  get isComingSoon(): boolean {
    return this.framework.framework_status === FrameworkStatus.COMINGSOON;
  }

  get isAuditorUser(): Observable<boolean> {
    return this.roleService.getCurrentUserRole().pipe(map((role) => role.role === RoleEnum.Auditor));
  }

  get isAvailable(): boolean {
    return this.framework.framework_status === FrameworkStatus.AVAILABLE;
  }

  constructor(
    public frameworkService: FrameworkService,
    public frameworkFacadeService: FrameworksFacadeService,
    public contentResolver: FrameworkContentService,
    private router: Router,
    private roleService: RoleService,
    private cd: ChangeDetectorRef,
    private controlsNavigator: ControlsNavigator,
    private controlsFacadeService: ControlsFacadeService
  ) { }

  ngOnInit(): void {
    this.inAudit = isDateBeforeToday(this.framework?.framework_current_audit?.audit_date);

    this.loadCurrentUserRole();
    this.controlsFacadeService
      .getControlsByFrameworkId(this.framework.framework_id)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((controls) => {
        this.controls = controls;
        this.contentRowsToDisplay = this.contentResolver.getContentRows(this.framework, controls);
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('framework' in changes) {
      this.framework = changes['framework'].currentValue;
      if (this.controls) {
        this.contentRowsToDisplay = this.contentResolver.getContentRows(this.framework, this.controls);
      }
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `frameworks.${relativeKey}`;
  }

  menuActionStarted(): void {
    this.contentLoader = true;
    this.cd.detectChanges();
  }

  menuActionFinished(): void {
    this.contentLoader = false;
    this.cd.detectChanges();
  }

  private loadCurrentUserRole(): void {
    this.roleService
      .getCurrentUserRole()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((role) => {
        this.currentUsersRole = role.role as RoleEnum;
      });
  }

}
