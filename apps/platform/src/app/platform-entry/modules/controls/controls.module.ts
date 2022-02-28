import { ControlsSwitcherModalsService } from 'core/modules/shared-controls/services/controls-switcher-modals/controls-switcher-modals.service';
import { DataFilterModule } from 'core/modules/data-manipulation/data-filter';
import { ControlsMultiSelectService, ControlsForFilteringProvider } from './services';
import { MultiselectModule } from 'core/modules/multiselect';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Route, RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutes, CoreModule } from 'core';
import { AccountFeaturesModule } from 'core/modules/account-features';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { SharedPluginsModule } from 'core/modules/shared-plugins';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import {
  ControlNoAdoptedFrameworksComponent,
  ControlsComponent,
  ControlsEmptyStateComponent,
  ControlsHeaderComponent,
  ControlsPageComponent,
  ControlsRendererComponent,
  ControlsSecondaryHeaderComponent,
  ExclusiveFrameworkAdoptionComponent,
  FrameworkControlsPartitionComponent,
  FrameworkInfoComponent,
  OnboardingCardComponent,
  SelectFrameworkComponent,
} from './components';
import { ControlsSharedModule } from 'core/modules/shared-controls/shared-controls.module';
import { ButtonsModule } from 'core/modules/buttons';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';
import { SharedPoliciesModule } from 'core/modules/shared-policies/shared-policies.module';
import { RenderingModule } from 'core/modules/rendering';
import { CommentingModule } from 'core/modules/commenting';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './store/effects';
import { AuditControlsComponent } from './components/audit-controls/audit-controls.component';

const routes: Route[] = [{ path: '', component: ControlsPageComponent },
{
  path: AppRoutes.ControlsFrameworkSnapshot,
  component: AuditControlsComponent
}];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    CommentingModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    MatExpansionModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    PerfectScrollbarModule,
    MatChipsModule,
    ReactiveFormsModule,
    DynamicFormModule,
    ControlsSharedModule,
    NgbTooltipModule,
    SearchModule,
    MultiselectModule,
    SharedPluginsModule,
    AccountFeaturesModule,
    VirtualScrollerModule,
    ButtonsModule,
    DropdownMenuModule,
    DataFilterModule,
    SharedPoliciesModule,
    RenderingModule,
    EffectsModule.forFeature(effects)
  ],
  declarations: [
    ControlsSecondaryHeaderComponent,
    FrameworkControlsPartitionComponent,
    ControlsEmptyStateComponent,
    ControlsRendererComponent,
    ControlsPageComponent,
    ControlsHeaderComponent,
    ControlNoAdoptedFrameworksComponent,
    ControlsComponent,
    ExclusiveFrameworkAdoptionComponent,
    OnboardingCardComponent,
    FrameworkInfoComponent,
    SelectFrameworkComponent,
    AuditControlsComponent,
  ],
  exports: [],
  entryComponents: [],
  providers: [ControlsMultiSelectService, ControlsSwitcherModalsService, ControlsForFilteringProvider, ControlsMultiSelectService],
})
export class ControlsModule {}
