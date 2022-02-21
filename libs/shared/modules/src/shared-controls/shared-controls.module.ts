import { TipsModule } from './../tips/tips.module';
import { CommonModule, DatePipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccountFeaturesModule } from 'core/modules/account-features';
import { ButtonsModule } from 'core/modules/buttons';
import { GridModule } from 'core/modules/grid';
import { MultiselectModule } from 'core/modules/multiselect';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { SharedPluginsModule } from 'core/modules/shared-plugins';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { CoreModule } from 'core';
import { NewlyAddedModule } from '../newly-added-label';
import {
  AttachLinkModalWindowComponent,
  AutomatePluginButtonComponent,
  ControlItemComponent,
  ControlMenuComponent,
  ControlsExportModalComponent,
  ControlRequirementComponent,
  ControlRequirementListComponent,
  ControlsProgressBarComponent,
  ControlsStatusBarComponent,
  ControlStatusComponent,
  ElementInfoComponent,
  EvidenceCollectionSkeletonComponent,
  EvidenceEmptyStateComponent,
  EvidenceItemComponent,
  EvidenceTabularPreviewComponent,
  EvidencesListComponent,
  FilePreviewComponent,
  FrameworkProgressBarComponent,
  FullFilePreviewModalComponent,
  JiraAutomationModalWindowComponent,
  LinkedControlsLabelComponent,
  LinkedFilesModalComponent,
  LinkEntityComponent,
  PluginsAutomationModalWindowComponent,
  PreviewCellComponent,
  SlackModalComponent,
  SnapshotMenuComponent,
  TicketingModalComponent,
  UploadUrlModalComponent,
  ZendeskAutomationModalWindowComponent,
  ViewControlModal,
} from './components';
import { RequirementLikeComponent } from './components/requirement-like/requirement-like.component';
import { CollectingEvidenceHostDirective, SharedContextAccessorDirective } from './directives';
import { CustomizationModule } from './modules';
import {
  ViewControlModalService,
  ControlsSwitcherModalsService,
  ControlContexInjectionToken,
  ControlContextConfig,
  ControlContextService,
  ControlsCsvExportService,
  ControlsFocusingService,
  ControlsNavigator,
  EvidenceCollectionModalService,
  EvidenceFromPolicyPreviewService
} from './services';
import { UtilsModule } from 'core/modules/utils';
import { GapModule } from 'core/modules/gap';
import { NotesModule } from 'core/modules/notes';
import { FileViewerModule } from 'core/modules/file-viewer';
import { EvidenceReportComponent } from './components/preview/evidence-report/evidence-report.component';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { SharedPoliciesModule } from 'core/modules/shared-policies/shared-policies.module';
import {
  EvidenceConnectComponent,
  EvidenceInfoComponent,
  EvidenceListComponent,
  LinkingEvidenceComponent,
} from 'core/modules/shared-controls/modules/evidence/components';
import { EvidenceModalService } from 'core/modules/shared-controls/modules/evidence/services';
import { PolicyModalService } from 'core/modules/shared-policies/services';

import { ControlStatusTooltipComponent } from './components/control-status-tooltip/control-status-tooltip.component';
import { EvidenceLabelComponent } from './components/evidence-item/evidence-label/evidence-label.component';
import { EvidenceMitigationMarkComponent } from './components/evidence-not-mitigated-mark/evidence-mitigation-mark.component';
import { EvidenceMetadataComponent } from './components/evidence-metadata/evidence-metadata.component';
import { ControlGuidelineComponent } from './components/control-guideline/control-guideline.component';
import { ControlsExportMenuComponent } from './components/controls-export-menu/controls-export-menu.component';
import { EvidenceListFilterComponent } from './modules/evidence/components/evidence-list-filter/evidence-list-filter.component';
import { RenderingModule } from 'core/modules/rendering';
import { SharedEvidenceModule } from 'core/modules/shared-evidence';
import { DataManipulationModule } from 'core/modules/data-manipulation';
import { EvidenceFacadeService, FrameworksFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { ExportToCsvButtonComponent } from 'core/modules/shared-controls/components/export-to-csv-button/export-to-csv-button.component';
import { EvidenceCopyNameComponent } from './components/evidence-item/evidence-copy-name/evidence-copy-name.component';
import { FocusingMechanismModule } from 'core/modules/focusing-mechanism';
import { ServiceInstanceMenuComponent } from './components/preview/service-instance-menu/service-instance-menu.component';
import { EvidencePreviewItemComponent } from './components/evidence-preview-item/evidence-preview-item.component';
import { EvidencePreviewHeaderComponent } from './components/evidence-preview-header/evidence-preview-header.component';
import { FrameworksPluginsListComponent } from 'core/modules/shared-controls/modules/frameworks-plugins/components/frameworks-plugins-list/frameworks-plugins-list.component';
import { FrameworksPluginsListSearchComponent } from 'core/modules/shared-controls/modules/frameworks-plugins/components/frameworks-plugins-list-search/frameworks-plugins-list-search.component';
import { FrameworksPluginsListItemComponent } from 'core/modules/shared-controls/modules/frameworks-plugins/components/frameworks-plugins-list-item/frameworks-plugins-list-item.component';
import { FrameworksPluginsModalService } from 'core/modules/shared-controls/modules/frameworks-plugins/services/frameworks-plugins-modal/frameworks-plugins-modal.service';
import { CommentingModule } from 'core/modules/commenting';
import { CfgEvidenceGridComponent } from './components/preview/cfg-evidence-grid/cfg-evidence-grid.component';
import { TableLikeEvidenceGridComponent } from './components/preview/table-like-evidence-grid/table-like-evidence-grid.component';
import { EvidencePreviewHostComponent } from './components/preview/evidence-preview-host/evidence-preview-host.component';
import { ControlViewItemComponent } from './components/control-preview/control-view-item/control-view-item.component';
import { RequirementViewItemComponent } from './components/control-preview/requirement-view-item/requirement-view-item.component';
import { EvidenceViewItemComponent } from './components/control-preview/evidence-view-item/evidence-view-item.component';
import { EvidenceFromPolicyPreviewComponent } from './components/preview/evidence-from-policy-preview/evidence-from-policy-preview.component';
import { ControlOwnerComponent } from './components/control-owner/control-owner.component';
import { UrlPreviewComponent } from './components/preview/url-preview/url-preview.component';
import { InviteUserModule } from 'core/modules/invite-user';
import { ModalsModule } from 'core/modules/modals';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    CommentingModule,
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
    VirtualScrollerModule,
    DynamicFormModule,
    CustomizationModule,
    NotesModule,
    DropdownMenuModule,
    PdfViewerModule,
    SearchModule,
    MultiselectModule,
    SharedPluginsModule,
    GridModule,
    AccountFeaturesModule,
    NewlyAddedModule,
    ButtonsModule,
    RouterModule,
    SharedPluginsModule,
    TipsModule,
    UtilsModule,
    GapModule,
    FileViewerModule,
    SvgIconsModule,
    SharedPoliciesModule,
    CommentingModule,
    RenderingModule,
    SharedEvidenceModule,
    DataManipulationModule,
    InviteUserModule,
    ModalsModule
  ],
  declarations: [
    EvidenceCopyNameComponent,
    EvidencePreviewItemComponent,
    ControlMenuComponent,
    EvidenceItemComponent,
    EvidenceTabularPreviewComponent,
    FilePreviewComponent,
    FullFilePreviewModalComponent,
    ControlItemComponent,
    SlackModalComponent,
    PluginsAutomationModalWindowComponent,
    ControlRequirementComponent,
    SharedContextAccessorDirective,
    ControlRequirementListComponent,
    AttachLinkModalWindowComponent,
    JiraAutomationModalWindowComponent,
    PreviewCellComponent,
    ElementInfoComponent,
    LinkedFilesModalComponent,
    TicketingModalComponent,
    UploadUrlModalComponent,
    EvidenceCollectionSkeletonComponent,
    EvidenceEmptyStateComponent,
    LinkEntityComponent,
    RequirementLikeComponent,
    EvidencesListComponent,
    ControlsStatusBarComponent,
    ControlStatusComponent,
    ControlMenuComponent,
    EvidenceReportComponent,
    ZendeskAutomationModalWindowComponent,
    SnapshotMenuComponent,
    EvidenceConnectComponent,
    EvidenceInfoComponent,
    EvidenceListComponent,
    ControlsProgressBarComponent,
    ControlStatusTooltipComponent,
    EvidenceLabelComponent,
    EvidenceMitigationMarkComponent,
    EvidenceMetadataComponent,
    ControlGuidelineComponent,
    ControlsExportMenuComponent,
    EvidenceListFilterComponent,
    AutomatePluginButtonComponent,
    ExportToCsvButtonComponent,
    LinkingEvidenceComponent,
    ServiceInstanceMenuComponent,
    EvidencePreviewItemComponent,
    FrameworksPluginsListComponent,
    FrameworksPluginsListSearchComponent,
    FrameworksPluginsListItemComponent,
    EvidenceCopyNameComponent,
    EvidencePreviewHeaderComponent,
    ViewControlModal,
    CfgEvidenceGridComponent,
    TableLikeEvidenceGridComponent,
    EvidencePreviewHostComponent,
    FrameworkProgressBarComponent,
    LinkedControlsLabelComponent,
    CollectingEvidenceHostDirective,
    ControlViewItemComponent,
    RequirementViewItemComponent,
    EvidenceViewItemComponent,
    EvidenceFromPolicyPreviewComponent,
    ControlOwnerComponent,
    UrlPreviewComponent,
    ControlsExportModalComponent
  ],
  exports: [
    EvidenceCopyNameComponent,
    EvidencePreviewItemComponent,
    ControlMenuComponent,
    EvidenceItemComponent,
    EvidenceTabularPreviewComponent,
    EvidenceCollectionSkeletonComponent,
    EvidencesListComponent,
    FilePreviewComponent,
    FullFilePreviewModalComponent,
    PreviewCellComponent,
    ControlItemComponent,
    SlackModalComponent,
    ControlRequirementListComponent,
    ControlRequirementComponent,
    SharedContextAccessorDirective,
    PluginsAutomationModalWindowComponent,
    JiraAutomationModalWindowComponent,
    AttachLinkModalWindowComponent,
    ElementInfoComponent,
    EvidenceEmptyStateComponent,
    LinkEntityComponent,
    RequirementLikeComponent,
    ZendeskAutomationModalWindowComponent,
    ControlsStatusBarComponent,
    ControlMenuComponent,
    EvidenceInfoComponent,
    EvidenceListComponent,
    EvidenceConnectComponent,
    ControlStatusComponent,
    ControlsProgressBarComponent,
    EvidenceLabelComponent,
    ControlsExportMenuComponent,
    CommentingModule,
    ControlGuidelineComponent,
    ControlsExportMenuComponent,
    LinkingEvidenceComponent,
    ControlsExportMenuComponent,
    ServiceInstanceMenuComponent,
    ExportToCsvButtonComponent,
    FrameworksPluginsListComponent,
    FrameworksPluginsListSearchComponent,
    FrameworksPluginsListItemComponent,
    ViewControlModal,
    FrameworkProgressBarComponent,
    LinkedControlsLabelComponent,
    CollectingEvidenceHostDirective,
    ControlsExportModalComponent
  ],
  providers: [
    ControlsSwitcherModalsService,
    ViewControlModalService,
    ControlContextService,
    DatePipe,
    ControlsCsvExportService,
    EvidenceModalService,
    PolicyModalService,
    SharedPoliciesModule,
    EvidenceFacadeService,
    RequirementsFacadeService,
    FrameworksPluginsModalService,
    FrameworksFacadeService,
    EvidenceCollectionModalService,
    EvidenceFromPolicyPreviewService
  ],
})
export class ControlsSharedModule {
  static withContext(contextConfig: ControlContextConfig): ModuleWithProviders<ControlsSharedModule> {
    return {
      ngModule: ControlsSharedModule,
      providers: [
        {
          provide: ControlContexInjectionToken,
          useValue: contextConfig,
        },
      ],
    };
  }

  static forRoot(): ModuleWithProviders<ControlsSharedModule> {
    return {
      ngModule: ControlsSharedModule,
      providers: [
        ...FocusingMechanismModule.forRoot().providers,
        ControlsFocusingService,
        ControlsNavigator
      ]
    };
  }
}
