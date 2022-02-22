import { AgentModalService } from './services';
import { RenderingModule } from 'core/modules/rendering';
import { InviteUserModule } from 'core/modules/invite-user';
import { ComponentSwitcherModule } from 'core/modules/component-switcher/component-switcher.module';
import { DynamicFormModule } from 'core/modules/dynamic-form/dynamic-form.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from 'core';
import { AgentItemComponent } from './components/agent-item/agent-item.component';
import { AgentsLayoutComponent } from './components/agents-layout/agents-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { AgentManagementComponent } from './components/agent-management/agent-management.component';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';
import { AgentInfoTabComponent } from './components/agent-management/tabs/agent-info-tab/agent-info-tab.component';
import { AgentConnectedPluginsTabComponent } from './components/agent-management/tabs/agent-connected-plugins-tab/agent-connected-plugins-tab.component';
import { AgentLogsTabComponent } from './components/agent-management/tabs/agent-logs-tab/agent-logs-tab.component';
import { ConnectorTabsEmptyStateComponent } from './components/connector-tabs-empty-state/connector-tabs-empty-state.component';

const routes: Route[] = [{ path: '', component: AgentsLayoutComponent }];

@NgModule({
  declarations: [
    AgentsLayoutComponent,
    AgentItemComponent,
    AgentManagementComponent,
    AgentInfoTabComponent,
    AgentConnectedPluginsTabComponent,
    AgentLogsTabComponent,
    ConnectorTabsEmptyStateComponent,
  ],
  providers: [AgentModalService],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    DynamicFormModule,
    ComponentSwitcherModule,
    InviteUserModule,
    PerfectScrollbarModule,
    VirtualScrollerModule,
    RenderingModule,
    DropdownMenuModule,
  ],
})
export class AgentsModule {}
