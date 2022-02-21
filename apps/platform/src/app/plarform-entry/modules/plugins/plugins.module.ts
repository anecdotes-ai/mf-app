import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core';
import { ButtonsModule } from 'core/modules/buttons';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';
import { LoadersModule } from 'core/modules/loaders';
import { PluginsConnectionModule } from 'core/modules/plugins-connection';
import { RenderingModule } from 'core/modules/rendering';
import { ControlsSharedModule } from 'core/modules/shared-controls/shared-controls.module';
import { SharedPluginsModule } from 'core/modules/shared-plugins';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TipsModule } from 'core/modules/tips/tips.module';
import { PluginDetailsComponent, PluginsComponent } from './components';
import { PluginDetailsHeaderComponent } from './components/plugin-details/plugin-details-header/plugin-details-header.component';
import { PluginDetailsTabsCollectionComponent } from './components/plugin-details/plugin-details-tabs/plugin-details-tabs-collection/plugin-details-tabs-collection.component';
import { PluginInfoEvidenceComponent } from './components/plugin-details/plugin-details-tabs/plugin-info-tab/plugin-info-evidence/plugin-info-evidence.component';
import { PluginInfoTabComponent } from './components/plugin-details/plugin-details-tabs/plugin-info-tab/plugin-info-tab.component';
import { PluginLogsTabComponent } from './components/plugin-details/plugin-details-tabs/plugin-logs-tab/plugin-logs-tab.component';
import { PluginPermissionsTabComponent } from './components/plugin-details/plugin-details-tabs/plugin-permissions-tab/plugin-permissions-tab.component';
import { PluginsHeaderComponent } from './components/plugins-header/plugins-header.component';
import { pluginIdParam } from 'core/models';

const routes: Route[] = [
  { path: '', component: PluginsComponent, pathMatch: 'full' },
  { path: `:${pluginIdParam}`, component: PluginDetailsComponent },
];

@NgModule({
  imports: [
    CoreModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    DynamicFormModule,
    MatExpansionModule,
    ControlsSharedModule,
    SearchModule,
    SharedPluginsModule,
    ButtonsModule,
    TipsModule,
    DropdownMenuModule,
    PluginsConnectionModule,
    RenderingModule,
    LoadersModule,
  ],
  declarations: [
    PluginsComponent,
    PluginDetailsComponent,
    PluginsHeaderComponent,
    PluginDetailsHeaderComponent,
    PluginDetailsTabsCollectionComponent,
    PluginInfoTabComponent,
    PluginPermissionsTabComponent,
    PluginLogsTabComponent,
    PluginInfoEvidenceComponent,
  ],
  exports: [],
  entryComponents: [],
})
export class PluginsModule {}
