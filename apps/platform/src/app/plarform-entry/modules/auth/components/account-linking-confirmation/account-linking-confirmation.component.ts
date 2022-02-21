import { Component, OnDestroy, OnInit } from '@angular/core';
import { WindowHelperService } from 'core';
import { AuthService } from 'core/modules/auth-core/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { SubscriptionDetacher } from 'core/utils';
import { SignInContext } from '../../models';

@Component({
  selector: 'app-account-linking-confirmation',
  templateUrl: './account-linking-confirmation.component.html',
  styleUrls: ['./account-linking-confirmation.component.scss']
})
export class AccountLinkingConfirmationComponent implements OnInit, OnDestroy {
  private subscriptionDetacher = new SubscriptionDetacher();
  context: SignInContext;

  constructor(private authService: AuthService, private componentSwitcher: ComponentSwitcherDirective, private windowHelper: WindowHelperService) { }

  ngOnInit(): void {
    this.componentSwitcher.sharedContext$.pipe(this.subscriptionDetacher.takeUntilDetach()).subscribe((ctx) => this.context = ctx);
  }

  ngOnDestroy(): void {
    this.subscriptionDetacher.detach();
  }

  async linkCredentials(): Promise<void> {
    await this.authService.linkWithCredentialAsync(this.context.accountLinking.email, this.context.accountLinking.credential);
    this.windowHelper.redirectToOrigin();
  }

  cancel(): void {
    this.componentSwitcher.goBack();
  }

  buildTranslationKey(relativeKey: string): string {
    return `auth.accountLinkingPage.${relativeKey}`;
  }
}
