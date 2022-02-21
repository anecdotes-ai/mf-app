import { CommonModule } from '@angular/common';
import { UtilsModule } from 'core/modules/utils';
import { CoreModule } from 'core/core.module';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  MitigationControlsSection,
  SectionHeader,
  MitigateControlItem,
  RiskCategoryIndicatorComponent,
  RiskEffectsComponent,
  RiskItemComponent,
  RiskItemHeaderComponent,
  RiskItemMenuComponent,
  RiskLevelIndicatorComponent,
  RiskManagementPageComponent,
  RiskTagDropdownComponent,
  RiskAnalysisComponent,
  RiskAanlysisItemComponent,
  RiskRegistryModal,
  RiskRegistryComponent,
  RiskRegistryItemComponent,
  RiskImpactIndicatorComponent,
  RiskLiklihoodIndicatorComponent,
  RiskSupportingDocumentsComponent,
  RiskStrategyIndicatorComponent,
  RiskManagementContentComponent,
  RiskOwnerComponent,
  RiskGridHeaderComponent,
  RiskInfoComponent,
  RiskEditableFieldComponent,
  RiskSourceLabelComponent,
  RiskDatesComponent,
  RiskDatesItemComponent,
  RiskEvidenceComponent,
  RiskEvidenceMenuComponent,
  RiskEvidenceAttachButtonComponent,
} from './components';
import { LoadersModule } from 'core/modules/loaders';
import { DropdownAtomsModule, DropdownMenuModule } from 'core/modules/dropdown-menu';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { RiskDataModule } from 'core/modules/risk';
import { MatExpansionModule } from '@angular/material/expansion';
import { MainHeaderModule } from 'core/modules/component-modules';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { DataFilterModule } from 'core/modules/data-manipulation/data-filter';
import { ControlsSharedModule } from 'core/modules/shared-controls/shared-controls.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormControlsModule } from 'core/modules/form-controls';
import { SharedEvidenceModule } from 'core/modules/shared-evidence';
import { RenderingModule } from 'core/modules/rendering';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AuthCoreModule } from 'core/modules/auth-core';
import { InviteUserModule } from 'core/modules/invite-user';

const routes: Route[] = [{ path: '', component: RiskManagementPageComponent }];

@NgModule({
  imports: [
    CoreModule,
    UtilsModule,
    TranslateModule,
    CommonModule,
    LoadersModule,
    DropdownMenuModule,
    DropdownAtomsModule,
    SvgIconsModule,
    RouterModule.forChild(routes),
    RiskDataModule,
    MatExpansionModule,
    UtilsModule,
    SearchModule,
    MainHeaderModule,
    SearchModule,
    DataFilterModule,
    RiskDataModule,
    ReactiveFormsModule,
    OverlayModule,
    PerfectScrollbarModule,
    FormsModule,
    FormControlsModule,
    SharedEvidenceModule,
    ControlsSharedModule,
    RenderingModule,
    AuthCoreModule,
    InviteUserModule
  ],
  providers: [NgbTooltip],
  declarations: [
    RiskManagementPageComponent,
    RiskTagDropdownComponent,
    MitigationControlsSection,
    SectionHeader,
    MitigateControlItem,
    RiskItemComponent,
    RiskCategoryIndicatorComponent,
    RiskEffectsComponent,
    RiskLevelIndicatorComponent,
    RiskItemHeaderComponent,
    RiskItemMenuComponent,
    RiskAnalysisComponent,
    RiskAanlysisItemComponent,
    RiskRegistryModal,
    RiskRegistryComponent,
    RiskRegistryItemComponent,
    RiskImpactIndicatorComponent,
    RiskLiklihoodIndicatorComponent,
    RiskSupportingDocumentsComponent,
    RiskStrategyIndicatorComponent,
    RiskManagementContentComponent,
    RiskOwnerComponent,
    RiskGridHeaderComponent,
    RiskInfoComponent,
    RiskEditableFieldComponent,
    RiskSourceLabelComponent,
    RiskDatesComponent,
    RiskDatesItemComponent,
    RiskEvidenceComponent,
    RiskEvidenceMenuComponent,
    RiskEvidenceAttachButtonComponent,
  ],
})
export class RiskManagementModule {}
