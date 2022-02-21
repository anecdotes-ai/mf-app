import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutes, UpdatesService } from 'core';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { MenuAction } from 'core/modules/dropdown-menu';
import { NavigationModel, SubMenuPositionY } from 'core/modules/navigation-bar/models/navigation.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
  frameworksMenu: MenuAction[] = [];
  routes: NavigationModel[] = [
    {
      key: 'dashboard',
      route: AppRoutes.Dashboard,
      icon: 'dashboard',
      visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator],
      iconColorMode: 'stroke',
    },
    {
      key: 'frameworks',
      icon: 'frameworks',
      visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.Auditor],
      menuActions: this.frameworksMenu,
      menuPositionY: SubMenuPositionY.BELOW,
      route: AppRoutes.Frameworks,
      iconColorMode: 'fill',
    },
    {
      key: 'evidencePool',
      route: AppRoutes.EvidencePool,
      icon: 'evidence-pool',
      visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator],
      iconColorMode: 'fill',
    },
    {
      key: 'plugins',
      route: AppRoutes.Plugins,
      icon: 'plugins',
      visibleFor: [RoleEnum.Admin, RoleEnum.It],
      iconColorMode: 'fill',
    },
    {
      key: 'policyManager',
      route: AppRoutes.PolicyManager,
      icon: 'policy-nav',
      visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator],
      iconColorMode: 'fill',
      inBeta: false,
    },
    {
      key: 'riskManagement',
      route: AppRoutes.RiskManagement,
      icon: 'risk-management',
      visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator],
      iconColorMode: 'fill',
      inBeta: false,
    },
    {
      key: 'api',
      route: AppRoutes.Api,
      icon: 'api',
      visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator],
      iconColorMode: 'mixed',
    }
  ];

  initialized: boolean;

  constructor(
    private ngbTooltipConfig: NgbTooltipConfig,
    private router: Router,
    private frameworksFacadeService: FrameworksFacadeService,
    private updateService: UpdatesService // please DONT remove this import
  ) {}

  ngOnInit(): void {
    this.ngbTooltipConfig.tooltipClass = 'default-tooltip';
    this.ngbTooltipConfig.placement = 'right';
    this.ngbTooltipConfig.triggers = 'hover';
    this.ngbTooltipConfig.autoClose = false;
    this.ngbTooltipConfig.container = 'body';

    this.frameworksFacadeService
      .getApplicableFrameworks()
      .pipe(filter((frameworks) => !!frameworks.length))
      .subscribe((frameworks) => {
        this.frameworksMenu.splice(0, this.frameworksMenu.length);

        frameworks.forEach((framework) =>
          this.frameworksMenu.push({
            translationKey: framework.framework_name,
            icon: this.getFrameworkIconLink(framework.framework_icon_id ?? framework.framework_id),
            action: this.navigateToFrameworkManager.bind(this, framework.framework_name),
          })
        );
        this.frameworksMenu.push({
          translationKey: 'allFrameworks',
          action: this.navigateToAllFrameworks.bind(this),
          icon: 'user-menu/help',
          iconColorMode: 'transparent',
        });

        this.routes = [...this.routes];
      });
  }

  private navigateToFrameworkManager(relativeRoute: string): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([`/${AppRoutes.Frameworks}/${relativeRoute}/${AppRoutes.FrameworkOverview}`]));
  }

  private navigateToAllFrameworks(): void {
    this.router.navigate([`/${AppRoutes.Frameworks}`]);
  }

  private getFrameworkIconLink(frameworkId: string): string {
    return `frameworks/${frameworkId}`;
  }
}
