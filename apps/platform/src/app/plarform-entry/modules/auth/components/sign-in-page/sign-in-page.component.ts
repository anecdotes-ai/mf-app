import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ComponentSwitcherDirective, ComponentToSwitch } from 'core/modules/component-switcher';
import { UserNotExistErrorComponent } from '../user-not-exist-error/user-not-exist-error.component';
import { TenantDisabledErrorComponent } from '../tenant-disabled-error/tenant-disabled-error.component';
import { SignInComponentIds } from '../../models';
import { AccountLinkingConfirmationComponent } from '../account-linking-confirmation/account-linking-confirmation.component';
import { ConfirmationPageComponent } from '../confirmation-page/confirmation-page.component';
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss'],
})
export class SignInPageComponent implements AfterViewInit {
  @ViewChild('switcher', { static: true })
  private switcher: ComponentSwitcherDirective;

  componentsToSwitch: ComponentToSwitch[] = [
    {
      id: SignInComponentIds.SignIn,
      componentType: SignInComponent,
    },
    {
      id: SignInComponentIds.ConfirmationPage,
      componentType: ConfirmationPageComponent,
    },
    {
      id: SignInComponentIds.AccountLinking,
      componentType: AccountLinkingConfirmationComponent
    },
    {
      id: SignInComponentIds.UserNotExistError,
      componentType: UserNotExistErrorComponent
    },
    {
      id: SignInComponentIds.TenantDisabledError,
      componentType: TenantDisabledErrorComponent
    },
  ];

  ngAfterViewInit(): void {
    this.switcher.goById(SignInComponentIds.SignIn);
  }
}
