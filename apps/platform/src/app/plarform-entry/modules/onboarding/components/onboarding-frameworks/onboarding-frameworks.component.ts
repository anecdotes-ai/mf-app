import { OnboardingUserEventService } from './../../services/onboarding-user-event.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Framework } from 'core/modules/data/models/domain';
import { filter, take } from 'rxjs/operators';
import { MultiselectingItem } from 'core/models/multiselecting-item.model';
import { TipTypeEnum } from 'core/models/tip.model';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives/component-switcher/component-switcher.directive';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { OnboardingComponentIds } from './../../constants/onboarding.constants';
import { OnboardingSharedContext } from './../../models';

@Component({
  selector: 'app-onboarding-frameworks',
  templateUrl: './onboarding-frameworks.component.html',
  styleUrls: ['./onboarding-frameworks.component.scss'],
})
export class OnboardingFrameworksComponent implements OnInit, OnDestroy {
  constructor(
    private switcher: ComponentSwitcherDirective,
    private frameworksFacade: FrameworksFacadeService,
    private onboardingUserService: OnboardingUserEventService
  ) {}

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private contextData: OnboardingSharedContext;

  tipTypes = TipTypeEnum;
  multiselectItems: MultiselectingItem<Framework>[];

  private getFrameworkIconLink(frameworkId: string): string {
    return `frameworks/${frameworkId}`;
  }

  ngOnInit(): void {
    if (this.switcher?.sharedContext$) {
      this.getSwitcherContextData();
    }

    this.frameworksFacade
      .getAvailableFrameworks()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(
        (frameworks) =>
          (this.multiselectItems = frameworks.map(
            (framework) =>
              ({
                text: framework.framework_name,
                icon: this.getFrameworkIconLink(framework.framework_id),
                data: framework,
              } as MultiselectingItem)
          ))
      );
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `onboardingWizard.frameworks.${relativeKey}`;
  }

  onSkipClick(): void {
    const choosenFrameworkNames = this.multiselectItems
    .filter((selectItem) => selectItem.selected)
    .map((item) => item.data.framework_name);

    this.onboardingUserService.trackFrameworkChoosingEvent(choosenFrameworkNames);
    
    this.switcher.goById(OnboardingComponentIds.Plugins);
  }

  frameworkSelected(item: MultiselectingItem): void {
    if (item.selected) {
      this.contextData.selectedFramework.push(item.data);
    }
  }

  isAnyFrameworkSelected(): boolean {
    return this.multiselectItems.some((item) => item.selected);
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
