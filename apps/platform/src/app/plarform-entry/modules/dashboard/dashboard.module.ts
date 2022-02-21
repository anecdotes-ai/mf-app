import { NgModule } from '@angular/core';
import { DashboardActionItemComponent } from './components';
import { RouterModule, Route } from '@angular/router';
import { DashboardComponent } from './components';
import { CoreModule } from 'core';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FrameworkService } from 'core/modules/data/services';
import { DashboardHeaderContentResolverService } from './services';
import { DashboardHeaderComponent } from './components';
import { DashboardPluginsComponent } from './components';
import { DashboardActionComponent } from './components';
import { DashboardCategoriesComponent } from './components';
import { DashboardFrameworksComponent } from './components';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardPluginIconComponent } from './components/dashboard-plugins/dashboard-plugin-icon/dashboard-plugin-icon.component';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';

const routes: Route[] = [{ path: '', component: DashboardComponent }];

@NgModule({
  imports: [
    CoreModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    MatTabsModule,
    DropdownMenuModule
  ],
  declarations: [
    DashboardComponent,
    DashboardHeaderComponent,
    DashboardPluginsComponent,
    DashboardActionComponent,
    DashboardActionItemComponent,
    DashboardCategoriesComponent,
    DashboardFrameworksComponent,
    DashboardPluginIconComponent,
  ],
  exports: [],
  entryComponents: [],
  providers: [DashboardHeaderContentResolverService, FrameworkService],
})
export class DashboardModule {}
