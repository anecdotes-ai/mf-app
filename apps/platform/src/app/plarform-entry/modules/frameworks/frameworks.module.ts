import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import {
  FrameworkItemFooterComponent,
  FrameworksComponent,
  FrameworkMenuComponent,
  FrameworkManager,
  FrameworkOverview,
  FrameworkControlsStatus,
  FrameworkCategories,
  FrameworkCategoryItem,
  ControlStatusesChart,
  FrameworkAuditInfo,
  AuditorListComponent,
  FrameworkAuditHistory,
  AuditLogItem
} from './components';
import { FrameworksHeaderComponent } from './components/frameworks-header/frameworks-header.component';
import { FrameworkItemComponent } from './components/framework-item/framework-item.component';
import { AppRoutes, CoreModule } from 'core';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FrameworkContentService } from './services';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { AccountFeaturesModule } from 'core/modules/account-features';
import { ButtonsModule } from 'core/modules/buttons';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';
import { ControlsSharedModule } from 'core/modules/shared-controls/shared-controls.module';
import { RenderingModule } from 'core/modules/rendering';
import { DataSortModule } from 'core/modules/data-manipulation/sort';
import { NgChartsModule } from 'ng2-charts';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { SharedFrameworkModule } from 'core/modules/shared-framework';

const routes: Route[] = [
  {
    path: '', component: FrameworksComponent,
  },
  {
    path: AppRoutes.FrameworkManager,
    component: FrameworkManager,
    children: [
      {
        path: AppRoutes.FrameworkOverview,
        component: FrameworkOverview,
      },
      {
        path: AppRoutes.FrameworkAuditHistory,
        component: FrameworkAuditHistory,
      },
      { path: '', redirectTo: AppRoutes.FrameworkOverview, pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [
    CoreModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    MatButtonModule,
    MatMenuModule,
    SearchModule,
    AccountFeaturesModule,
    ButtonsModule,
    DropdownMenuModule,
    ControlsSharedModule,
    RenderingModule,
    DataSortModule,
    NgChartsModule,
    DynamicFormModule,
    SharedFrameworkModule
  ],
  declarations: [
    FrameworksComponent,
    FrameworksHeaderComponent,
    FrameworkItemComponent,
    FrameworkItemFooterComponent,
    FrameworkMenuComponent,
    FrameworkManager,
    FrameworkOverview,
    FrameworkControlsStatus,
    FrameworkCategories,
    FrameworkCategoryItem,
    ControlStatusesChart,
    FrameworkAuditInfo,
    AuditorListComponent,
    FrameworkAuditHistory,
    AuditLogItem
  ],
  exports: [],
  entryComponents: [],
  providers: [FrameworkContentService],
})
export class FrameworksModule { }
