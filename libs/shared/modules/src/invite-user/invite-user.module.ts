import { InviteUserEventsService } from './services/invite-user-events-service/invite-user-events.service';
import { InviteUserModalService } from './services/invite-user-modal/invite-user-modal.service';
import { InviteItUserComponent, InviteUserModalComponent, UserDropdownControlComponent } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'core/core.module';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownAtomsModule } from 'core/modules/dropdown-menu';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlsModule } from 'core/modules/form-controls';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [InviteItUserComponent, InviteUserModalComponent, UserDropdownControlComponent],
  providers: [InviteUserModalService, InviteUserEventsService],
  imports: [
    CommonModule,
    CoreModule,
    DynamicFormModule,
    TranslateModule.forChild(),
    DropdownAtomsModule,
    ReactiveFormsModule,
    FormControlsModule,
    NgbTooltipModule,
    OverlayModule,
  ],
  exports: [InviteItUserComponent, InviteUserModalComponent, UserDropdownControlComponent],
})
export class InviteUserModule {}
