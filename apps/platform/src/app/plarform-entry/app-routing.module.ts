import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MobileComingSoonComponent } from 'core';
import { AppRoutes } from 'core/constants';
import { AuditorPortalGuard, RedirectGuard } from 'core/guards';
import { AuthGuardService, AuthRoleGuard } from 'core/modules/auth-core/services';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { environment } from 'src/environments/environment';
import { RootComponent } from './components';
import { InitializerCanActivateService } from 'core/services';
import { MobileAndNotSupportBrowserViewGuardService, TranslateResolverService } from './services';
import { PluginRedirectionGuardService } from 'core/modules/auth-core/services';
import { DataInitalizationCanActivate } from 'core/modules/data-initialization';

const routes: Route[] = [
  {
    path: '',
    // TODO: PluginRedirectionGuardService to be removed when we migrate all customers to firebase
    canActivate: [TranslateResolverService, PluginRedirectionGuardService],
    children: [
      {
        path: '',
        canActivate: [MobileAndNotSupportBrowserViewGuardService],
        children: [
          {
            path: '',
            canActivate: [AuthGuardService, InitializerCanActivateService],
            children: [
              {
                path: '',
                component: RootComponent,
                canActivate: [DataInitalizationCanActivate],
                children: [
                  {
                    path: '',
                    children: [
                      {
                        path: AppRoutes.Dashboard,
                        canActivate: [AuthRoleGuard],
                        data: { roles: [RoleEnum.Admin, RoleEnum.User, RoleEnum.Collaborator] },
                        loadChildren: () =>
                          import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
                      },
                      { path: AppRoutes.MyControls, redirectTo: AppRoutes.EvidencePool, pathMatch: 'full' },
                      {
                        path: AppRoutes.EvidencePool,
                        canActivate: [AuthRoleGuard],
                        data: { roles: [RoleEnum.Admin, RoleEnum.User, RoleEnum.Collaborator] },
                        loadChildren: () =>
                          import('./modules/evidence-pool/evidence-pool.module').then((m) => m.EvidencePoolModule),
                      },
                      {
                        path: AppRoutes.EvidencePool,
                        canActivate: [AuthRoleGuard],
                        data: { roles: [RoleEnum.Admin, RoleEnum.User, RoleEnum.Collaborator] },
                        loadChildren: () =>
                          import('./modules/evidence-pool/evidence-pool.module').then((m) => m.EvidencePoolModule),
                      },
                      {
                        path: AppRoutes.Controls,
                        canActivate: [AuthRoleGuard],
                        data: { roles: [RoleEnum.Admin, RoleEnum.User, RoleEnum.Collaborator, RoleEnum.Auditor] },
                        loadChildren: () => import('./modules/controls/controls.module').then((m) => m.ControlsModule),
                      },
                      {
                        path: AppRoutes.Frameworks,
                        canActivate: [AuthRoleGuard],
                        data: { roles: [RoleEnum.Admin, RoleEnum.User, RoleEnum.Collaborator, RoleEnum.Auditor] },
                        loadChildren: () =>
                          import('./modules/frameworks/frameworks.module').then((m) => m.FrameworksModule),
                      },
                      {
                        path: AppRoutes.Settings,
                        canActivate: [AuthRoleGuard],
                        data: { roles: [RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.It] },
                        loadChildren: () => import('./modules/settings/settings.module').then((m) => m.SettingsModule),
                      },
                      {
                        path: AppRoutes.Api,
                        canActivate: [AuthRoleGuard],
                        data: { roles: [RoleEnum.Admin, RoleEnum.User, RoleEnum.Collaborator] },
                        loadChildren: () => import('./modules/api/api.module').then((m) => m.ApiModule),
                      },
                      {
                        path: AppRoutes.Plugins,
                        canActivate: [AuthRoleGuard],
                        data: { roles: [RoleEnum.Admin, RoleEnum.User, RoleEnum.It] },
                        loadChildren: () => import('./modules/plugins/plugins.module').then((m) => m.PluginsModule),
                      },
                      {
                        path: AppRoutes.PolicyManager,
                        canActivate: [AuthRoleGuard],
                        data: { roles: [RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.User] },
                        loadChildren: () =>
                          import('./modules/policy-manager/policy-manager.module').then((m) => m.PolicyManagerModule),
                      },
                      {
                        path: AppRoutes.RiskManagement,
                        data: { roles: [RoleEnum.Admin, RoleEnum.Collaborator] },
                        loadChildren: () =>
                          import('./modules/risk-management/risk-management.module').then(
                            (m) => m.RiskManagementModule
                          ),
                      },
                    ],
                    canActivate: [AuditorPortalGuard, RedirectGuard],
                    pathMatch: 'prefix',
                  },
                  {
                    path: AppRoutes.WelcomePage,
                    loadChildren: () => import('./modules/welcome/welcome.module').then((m) => m.WelcomeModule),
                    canActivate: [AuditorPortalGuard, RedirectGuard],
                  },
                ],
              },
              {
                path: AppRoutes.AuditorsPortal,
                canActivate: [AuditorPortalGuard, AuthGuardService],
                loadChildren: () =>
                  import('./modules/auditors-portal/auditors-portal.module').then((m) => m.AuditorsPortalModule),
              },
              {
                path: AppRoutes.ExecutiveReport,
                loadChildren: () =>
                  import('./modules/executive-report/executive-report.module').then((m) => m.ExecutiveReportModule),
              },
            ],
          },
          {
            path: `${AppRoutes.ViewEvidence}/:evidence_instance_id/raw`,
            canActivate: [AuthGuardService, InitializerCanActivateService],
            loadChildren: () =>
              import('./modules/view-evidence/view-evidence.module').then((m) => m.ViewEvidenceModule),
          },
          {
            path: `${AppRoutes.ControlsReport}`,
            canActivate: [AuthGuardService, InitializerCanActivateService, DataInitalizationCanActivate],
            loadChildren: () =>
              import('core/modules/shared-controls/modules/controls-report/controls-report.module').then(
                (m) => m.ControlsReportModule
              ),
          },
          {
            path: `${AppRoutes.FrameworkReport}`,
            canActivate: [AuthGuardService, InitializerCanActivateService, DataInitalizationCanActivate],
            loadChildren: () =>
              import('core/modules/shared-controls/modules/framework-report/framework-report.module').then(
                (m) => m.FrameworkReportModule
              ),
          },
        ],
      },
      {
        path: AppRoutes.Auth,
        loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'mobile-coming-soon',
        component: MobileComingSoonComponent,
      },
      {
        path: AppRoutes.PolicyExternalApproval,
        canActivate: [MobileAndNotSupportBrowserViewGuardService],
        loadChildren: () =>
          import('./modules/external-approval/external-approval.module').then((m) => m.ExternalApprovalModule),
      },
    ],
  },
];

if (!environment.production) {
  // There must be placed routes here that shouldn't be working on prod
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
