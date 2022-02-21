import { DataFilterModule } from 'core/modules/data-manipulation/data-filter';
import { DirectivesModule } from 'core/modules/directives';
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
import { CoreModule } from 'core';
import { AccountFeaturesModule } from 'core/modules/account-features';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { SharedPluginsModule } from 'core/modules/shared-plugins';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { ControlsSharedModule } from 'core/modules/shared-controls/shared-controls.module';
import { ButtonsModule } from 'core/modules/buttons';
import { EvidencePoolComponent, EvidencePoolHeaderComponent, EvidencePoolSecondaryHeaderComponent } from './components';
import { EvidencePoolItemComponent } from './components/evidence-pool-item/evidence-pool-item.component';
import { EvidenceHelpIconComponent } from './components/evidence-help-icon/evidence-help-icon.component';
import { TipsModule } from 'core/modules/tips/tips.module';
import { SharedPoliciesModule } from 'core/modules/shared-policies/shared-policies.module';
import { DataSortModule } from 'core/modules/data-manipulation/sort';
import { RenderingModule } from 'core/modules/rendering';

const routes: Route[] = [{ path: '', component: EvidencePoolComponent }];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
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
    SharedPluginsModule,
    AccountFeaturesModule,
    VirtualScrollerModule,
    ButtonsModule,
    MultiselectModule,
    DirectivesModule,
    DataFilterModule,
    TipsModule,
    SharedPoliciesModule,
    DataSortModule,
    RenderingModule,
  ],
  declarations: [
    EvidencePoolComponent,
    EvidencePoolHeaderComponent,
    EvidencePoolSecondaryHeaderComponent,
    EvidencePoolItemComponent,
    EvidenceHelpIconComponent,
  ],
  exports: [],
  entryComponents: [],
  providers: [],
})
export class EvidencePoolModule {}
