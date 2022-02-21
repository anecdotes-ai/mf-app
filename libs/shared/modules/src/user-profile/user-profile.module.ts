import { UtilsModule } from 'core/modules/utils';
import { LoadersModule } from './../loaders/loaders.module';
import { ModalsModule } from './../modals/modals.module';
import { ButtonsModule } from './../buttons/buttons.module';
import { DynamicFormModule } from './../dynamic-form/dynamic-form.module';
import { DirectivesModule } from './../directives';
import { ComponentSwitcherModule } from './../component-switcher/component-switcher.module';
import {
  UserProfileIconComponent,
  UserProfileMenuComponent,
} from './components';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlsModule } from 'core/modules/form-controls';

@NgModule({
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
    DynamicFormModule,
    ButtonsModule,
    ModalsModule,
    LoadersModule,
    FormControlsModule,
    UtilsModule,
  ],
  declarations: [
    UserProfileIconComponent,
    UserProfileMenuComponent,
  ],
  exports: [
    UserProfileIconComponent,
    UserProfileMenuComponent,
  ],
})
export class UserProfileModule {}
