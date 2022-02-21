import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { CoreModule } from 'core/core.module';
import { ButtonsModule } from './../buttons/buttons.module';
import { PolicyModalService } from './services';
import { PolicySettingsComponent } from './components/policy-settings/policy-settings.component';
import { PolicyRoleComponent } from './components/policy-role/policy-role.component';
import { PolicySchedulingComponent } from './components/policy-scheduling/policy-scheduling.component';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { UtilsModule } from 'core/modules/utils';
import { PolicyPreviewComponent } from './components/policy-preview/policy-preview.component';
import { GridModule } from 'core/modules/grid';
import { StatusBadgeModule } from 'core/modules/status-badge';
import { PolicyApproveOnBehalfComponent } from './components/policy-approve-on-behalf/policy-approve-on-behalf.component';
import { SendForApprovalComponent } from './components/send-for-approval/send-for-approval.component';
import { TipsModule } from 'core/modules/tips/tips.module';
import { PolicyPreviewEmptyStateComponent } from './components/policy-preview-empty-state/policy-preview-empty-state.component';
import { PolicyLinkedControlsLabelComponent } from './components/policy-linked-controls-label/policy-linked-controls-label.component';
import { PolicyApprovalComponent } from './components/policy-approval/policy-approval.component';

@NgModule({
  declarations: [
    PolicySettingsComponent,
    PolicyRoleComponent,
    PolicySchedulingComponent,
    PolicyPreviewComponent,
    PolicyApproveOnBehalfComponent,
    SendForApprovalComponent,
    PolicyPreviewEmptyStateComponent,
    PolicyLinkedControlsLabelComponent,
    PolicyApprovalComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    SvgIconsModule,
    TranslateModule.forChild(),
    ButtonsModule,
    DynamicFormModule,
    UtilsModule,
    GridModule,
    StatusBadgeModule,
    TipsModule
  ],
  exports: [
    PolicyPreviewComponent,
    PolicyLinkedControlsLabelComponent,
    PolicyApprovalComponent
  ],
  providers: [PolicyModalService]
})
export class SharedPoliciesModule { }
