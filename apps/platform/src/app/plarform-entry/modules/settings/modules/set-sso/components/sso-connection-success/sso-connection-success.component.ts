import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { SubscriptionDetacher } from 'core/utils';
import {
  SelectedItemToSetSSO, SetSSOSharedContext
} from '../../models';

@Component({
  selector: 'app-sso-connection-success',
  templateUrl: './sso-connection-success.component.html',
  styleUrls: ['./sso-connection-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsoConnectionSuccessComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  @HostBinding('class')
  private classes = 'flex flex-column w-full h-full font-main';
  private switcherSharedContext: SetSSOSharedContext;
  
  selectedSSOItem: SelectedItemToSetSSO;
  primaryTextTranslationKey: string;
  secondaryTextTranslationKey: string;

  constructor(private componentSwitcher: ComponentSwitcherDirective, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.componentSwitcher.sharedContext$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((context: SetSSOSharedContext) => {
        this.switcherSharedContext = context;
        this.selectedSSOItem = context.selectedItemToSetSSO;
        this.primaryTextTranslationKey = context.successPrimaryTextTranslationKey;
        this.secondaryTextTranslationKey = context.successSecondaryTextTranslationKey;
        this.cd.detectChanges();
      });
  }

  gotIt(): void {
    this.switcherSharedContext.closeCallback();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }
}
