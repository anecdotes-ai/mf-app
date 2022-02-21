import { UtilsModule } from 'core/modules/utils';
import { ButtonsModule } from './../buttons/buttons.module';
import { DirectivesModule } from './../directives';
import { BaseModalComponent, ConfirmationModalWindowComponent, StatusWindowModalComponent, GlobalLoaderModalComponent } from './components';
import { ModalWindowService, GenericModalsService } from './services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherModule } from './../component-switcher/component-switcher.module';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlsModule } from './../form-controls';
import { LoadersModule } from 'core/modules/loaders';

@NgModule({
  declarations: [ConfirmationModalWindowComponent, StatusWindowModalComponent, BaseModalComponent, GlobalLoaderModalComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NgbTooltipModule,
    SvgIconsModule,
    ComponentSwitcherModule,
    RouterModule,
    NgbPopoverModule,
    DirectivesModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    ButtonsModule,
    UtilsModule,
    FormControlsModule,
    LoadersModule
  ],
  providers: [ModalWindowService, GenericModalsService],
  exports: [StatusWindowModalComponent, BaseModalComponent, ConfirmationModalWindowComponent, GlobalLoaderModalComponent],
})
export class ModalsModule { }
