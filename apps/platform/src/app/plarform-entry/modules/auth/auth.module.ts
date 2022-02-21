import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import {
  AuthComponent,
  IdpsLoginComponent,
  LoginAnecdotesComponent,
  SignInComponent,
  EmailLoginComponent,
  SignInPageComponent,
  ConfirmationPageComponent,
  TenantLogoComponent,
  EmailCallbackComponent,
  AccountLinkingConfirmationComponent,
  UserNotExistErrorComponent,
  TenantDisabledErrorComponent,
  TokenCallbackComponent
} from './components';
import { CoreModule } from 'core';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherModule } from 'core/modules/component-switcher';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { ForgotAccountComponent } from './components/forgot-account/forgot-account.component';
import { ForgotAccountPageComponent } from './components/forgot-account-page/forgot-account-page.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Route[] = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'sign-in', component: SignInPageComponent },
      { path: 'login-anecdotes', component: LoginAnecdotesComponent },
      { path: 'email-callback', component: EmailCallbackComponent },
      { path: 'token-callback', component: TokenCallbackComponent },
      { path: 'forgot-account', component: ForgotAccountPageComponent },
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'prefix'
      }
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    DynamicFormModule,
    TranslateModule,
    ComponentSwitcherModule,
    SvgIconsModule, 
    NgbTooltipModule
  ],
  declarations: [
    AuthComponent,
    SignInComponent,
    EmailLoginComponent,
    IdpsLoginComponent,
    LoginAnecdotesComponent,
    SignInPageComponent,
    ConfirmationPageComponent,
    TenantLogoComponent,
    EmailCallbackComponent,
    TokenCallbackComponent,
    AccountLinkingConfirmationComponent,
    UserNotExistErrorComponent,
    TenantDisabledErrorComponent,
    ForgotAccountComponent,
    ForgotAccountPageComponent,
    TokenCallbackComponent
  ],
})
export class AuthModule { }
