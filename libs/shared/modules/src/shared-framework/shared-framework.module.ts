import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FreezeFrameworksModalComponent, CreateFrameworkModalComponent } from './components';
import { FrameworkModalService } from './services';
import { CoreModule } from 'core/core.module';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { UtilsModule } from './../utils';
import { ConfigureAuditModalService, EndAuditModalService } from './services';
import { ConfigureAuditModalComponent, AuditStartedModal, EndAuditModal } from './components';
import { TipsModule } from 'core/modules/tips/tips.module';

@NgModule({
  providers: [
    FrameworkModalService,
    ConfigureAuditModalService,
    EndAuditModalService
  ],
  declarations: [
    FreezeFrameworksModalComponent,
    ConfigureAuditModalComponent,
    AuditStartedModal,
    EndAuditModal,
    CreateFrameworkModalComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    DynamicFormModule,
    TipsModule,
    UtilsModule,
    TranslateModule.forChild(),
  ],
  exports: [
    AuditStartedModal,
    CreateFrameworkModalComponent
  ]
})
export class SharedFrameworkModule { }
