import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core';
import { ComponentSwitcherModule } from 'core/modules/component-switcher';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {
    DisconnectConfirmationComponent, SetSsoButtonComponent, SetSsoPageComponent, SsoConnectionComponent,
    SsoConnectionSuccessComponent
} from './components';

const routes: Route[] = [{ path: '', component: SetSsoPageComponent }];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    DynamicFormModule,
    ComponentSwitcherModule,
  ],
  declarations: [
    SetSsoPageComponent,
    SetSsoButtonComponent,
    SsoConnectionComponent,
    SsoConnectionSuccessComponent,
    DisconnectConfirmationComponent,
  ],
})
export class SetSsoModule {}
