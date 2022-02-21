import { Component, OnInit } from '@angular/core';
import { Tenant } from 'core/modules/auth-core/models/domain';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Observable } from 'rxjs';
import { SignInContext } from '../../models';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.scss'],
})
export class ConfirmationPageComponent implements OnInit {
  currentTenant: Tenant;
  switcherContext$: Observable<SignInContext>;

  constructor(
    private componentSwitcherDirective: ComponentSwitcherDirective
  ) { }

  ngOnInit(): void {
    this.switcherContext$ = this.componentSwitcherDirective.sharedContext$;
  }

  buildTranslationKey(relativeKey: string): string {
    return `auth.confirmationPage.${relativeKey}`;
  }
}
