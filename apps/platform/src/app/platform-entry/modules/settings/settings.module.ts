import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutes, CoreModule } from 'core';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SettingsPageComponent } from './components';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { AuthRoleGuard } from 'core/modules/auth-core/services';
import { AppSettingsRoutesSegments } from 'core/constants/routes';
import { SettingsGuard } from 'core/modules/auth-core/services/settings-guard/settings.guard';

const routes: Route[] = [
  {
    path: '',
    component: SettingsPageComponent,
    children: [
      {
        canActivate: [SettingsGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Collaborator] },
        path: AppRoutes.UserManagement,
        loadChildren: () =>
          import('./modules/user-management/user-management.module').then((m) => m.UserManagementModule),
      },
      {
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Collaborator] },
        path: AppSettingsRoutesSegments.SetSSO,
        loadChildren: () => import('./modules/set-sso/set-sso.module').then((m) => m.SetSsoModule),
      },
      {
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.It] },
        path: AppSettingsRoutesSegments.Connectors,
        loadChildren: () => import('./modules/agents/agents.module').then((m) => m.AgentsModule),
      },
      {
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.It] },
        path: AppSettingsRoutesSegments.DataDelegation,
        loadChildren: () => import('./modules/data-delegation/data-delegation.module').then((m) => m.DataDelegationModule),
      },

      { path: '', redirectTo: AppRoutes.UserManagement, pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [
    CoreModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    DropdownMenuModule,
  ],
  declarations: [SettingsPageComponent],
})
export class SettingsModule {}
