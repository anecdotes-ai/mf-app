import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ComponentSwitcherDirective, ComponentToSwitch } from 'core/modules/component-switcher';
import { ConfirmationPageComponent } from '../confirmation-page/confirmation-page.component';
import { SignInComponentIds } from '../../models';
import { ForgotAccountComponent } from '../forgot-account/forgot-account.component';

@Component({
  selector: 'app-forgot-account-page',
  templateUrl: './forgot-account-page.component.html',
  styleUrls: ['./forgot-account-page.component.scss']
})
export class ForgotAccountPageComponent implements AfterViewInit {
  @ViewChild('switcher', { static: true })
  private switcher: ComponentSwitcherDirective;

  componentsToSwitch: ComponentToSwitch[] = [
    {
      id: SignInComponentIds.ForgotAccount,
      componentType: ForgotAccountComponent,
    },
    {
      id: SignInComponentIds.ConfirmationPage,
      componentType: ConfirmationPageComponent,
    },
  ];

  ngAfterViewInit(): void {
    this.switcher.goById(SignInComponentIds.ForgotAccount);
  }

}
