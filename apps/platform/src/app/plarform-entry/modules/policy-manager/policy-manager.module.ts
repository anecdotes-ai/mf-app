import { DropdownMenuModule } from 'core/modules/dropdown-menu/dropdown-menu.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyManagerComponent } from './components';
import { Route, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ControlsSharedModule } from 'core/modules/shared-controls/shared-controls.module';
import { MainHeaderModule } from 'core/modules/component-modules';
import { PolicyManagerContentComponent } from './components/policy-manager-content/policy-manager-content.component';
import { PolicyComponent } from './components/policy/policy.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CustomizationModule } from 'core/modules/customization';
import { PoliciesRendererComponent } from './components/policies-renderer/policies-renderer.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { NewlyAddedModule } from 'core/modules/newly-added-label';
import { ButtonsModule } from 'core/modules/buttons';
import { StatusBadgeModule } from 'core/modules/status-badge';
import { PolicyStatusComponent } from './components/policy-status/policy-status.component';
import { SharedPoliciesModule } from 'core/modules/shared-policies/shared-policies.module';
import { DataSortModule } from 'core/modules/data-manipulation/sort';
import { RenderingModule } from 'core/modules/rendering';
import { DataFilterModule } from 'core/modules/data-manipulation/data-filter';
import { AccountFeaturesModule } from 'core/modules/account-features';

const routes: Route[] = [{ path: '', component: PolicyManagerComponent }];

@NgModule({
  declarations: [PolicyManagerComponent, PolicyManagerContentComponent, PolicyComponent, PoliciesRendererComponent, PolicyStatusComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    DynamicFormModule,
    MatExpansionModule,
    ControlsSharedModule,
    SearchModule,
    MatProgressBarModule,
    MainHeaderModule,
    MainHeaderModule,
    CustomizationModule,
    VirtualScrollerModule,
    NewlyAddedModule,
    ButtonsModule,
    StatusBadgeModule,
    SharedPoliciesModule,
    DataSortModule,
    RenderingModule,
    DropdownMenuModule,
    DataFilterModule,
    AccountFeaturesModule
  ],
  exports: [PolicyManagerComponent, PolicyComponent]
})
export class PolicyManagerModule { }
