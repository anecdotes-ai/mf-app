import { OnboardingUserEventService } from './../../services/onboarding-user-event.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MultiselectingItem } from 'core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Service } from 'core/modules/data/models/domain';
import { PluginFacadeService, PluginService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { filter, take } from 'rxjs/operators';
import { OnboardingComponentIds } from './../../constants/onboarding.constants';
import { OnboardingSharedContext } from './../../models/onboarding-shared-context.model';

@Component({
  selector: 'app-onboarding-policy-managing',
  templateUrl: './onboarding-policy-managing.component.html',
  styleUrls: ['./onboarding-policy-managing.component.scss'],
})
export class OnboardingPolicyManagingComponent implements OnInit, OnDestroy {
  constructor(
    private switcher: ComponentSwitcherDirective,
    private pluginsFacade: PluginFacadeService,
    private pluginService: PluginService,
    private onboardingUserService: OnboardingUserEventService
  ) {}

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private contextData: OnboardingSharedContext;

  multiselectableItems: MultiselectingItem<Service>[];

  ngOnInit(): void {
    if (this.switcher?.sharedContext$) {
      this.getSwitcherContextData();
    }

    this.pluginsFacade
      .getPluginsForOnboardingPolicy()
      .pipe(
        this.detacher.takeUntilDetach()
      )
      .subscribe((plugins) => {
        this.multiselectableItems = plugins.map(
          (plugin) =>
            ({
              text: plugin.service_display_name,
              icon: this.pluginService.getServiceIconLinkSync(plugin.service_id),
              data: plugin,
            } as MultiselectingItem)
        );
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `onboardingWizard.policy.${relativeKey}`;
  }

  onNextClick(): void {
    const chosenPoliciesNames = this.multiselectableItems
    .filter((selectItem) => selectItem.selected)
    .map((item) => item.data.service_display_name);

    this.onboardingUserService.trackFilesPoliciesChoosingEvent(chosenPoliciesNames);

    this.switcher.goById(OnboardingComponentIds.Company);
  }

  onBackClick(): void {
    this.switcher.goById(OnboardingComponentIds.Policy);
  }

  isAnyPluginSelected(): boolean {
    return this.multiselectableItems.some((item) => item.selected);
  }

  pluginSelected(item: MultiselectingItem): void {
    if (item.selected) {
      this.contextData.selectedPlugins.push(item.data);
    }
  }

  private async getSwitcherContextData(): Promise<void> {
    this.contextData = await this.switcher.sharedContext$
      .pipe(
        filter((c) => !!c),
        take(1),
        this.detacher.takeUntilDetach()        
      )
      .toPromise();
  }
}
