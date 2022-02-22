import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { SamlFacadeService } from 'core/modules/auth-core/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject } from 'rxjs';
import {
  SelectedItemToSetSSO, SetSSOModalsIds, SetSSOSharedContext, translationRootKey
} from '../../models';

@Component({
  selector: 'app-disconnect-confirmation',
  templateUrl: './disconnect-confirmation.component.html',
  styleUrls: ['./disconnect-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisconnectConfirmationComponent implements OnInit {
  private detacher = new SubscriptionDetacher();
  @HostBinding('class')
  private classes = 'flex flex-column w-full h-full font-main';

  private switcherSharedContext: SetSSOSharedContext;
  selectedSSOItem: SelectedItemToSetSSO;
  disconnectProcessing$ = new BehaviorSubject(false);

  constructor(private componentSwitcher: ComponentSwitcherDirective,
    private samlFacadeService: SamlFacadeService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.componentSwitcher.sharedContext$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((context: SetSSOSharedContext) => {
        this.switcherSharedContext = context;
        this.selectedSSOItem = context.selectedItemToSetSSO;
        this.cd.detectChanges();
      });
  }

  buildTranslationKey(relativeKey: string): string {
    return `${translationRootKey}.${relativeKey}`;
  }

  async confirm(): Promise<void> {
    this.disconnectProcessing$.next(true);

    try {
      await this.samlFacadeService.deleteSSOLink(this.selectedSSOItem.idp_id);
      await this.switcherSharedContext.disconnectCallBack();
      this.displaySuccessState();
    } finally {
      this.disconnectProcessing$.next(false);
    }
  }

  back(): void {
    this.componentSwitcher.goBack();
  }

  private displaySuccessState(): void {
    this.componentSwitcher.changeContext({
      ...this.switcherSharedContext,
      successPrimaryTextTranslationKey: this.buildTranslationKey('disconnectionSuccess.primaryText'),
    } as SetSSOSharedContext);
    this.componentSwitcher.goById(SetSSOModalsIds.SuccesscfullySetteledSSO);
  }
}
