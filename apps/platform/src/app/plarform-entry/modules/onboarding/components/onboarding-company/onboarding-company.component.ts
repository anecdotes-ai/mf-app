import { Component, OnDestroy, OnInit } from '@angular/core';
import { InviteUserSource } from 'core/models/user-events/user-event-data.model';
import {
  CustomerFacadeService,
  FrameworksFacadeService,
  PluginFacadeService,
  TrackOperations,
} from 'core/modules/data/services';
import { filter, take } from 'rxjs/operators';
import { TipTypeEnum } from 'core/models/tip.model';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives/component-switcher/component-switcher.directive';
import { OperationsTrackerService } from 'core/modules/data/services/operations-tracker/operations-tracker.service';
import { InviteUserModalService } from 'core/modules/invite-user/services/invite-user-modal/invite-user-modal.service';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { OnboardingComponentIds } from './../../constants/onboarding.constants';
import { OnboardingSharedContext } from './../../models';
import { OnboardingUserEventService } from '../../services/onboarding-user-event.service';

@Component({
  selector: 'app-onboarding-company',
  templateUrl: './onboarding-company.component.html',
  styleUrls: ['./onboarding-company.component.scss'],
})
export class OnboardingCompanyComponent implements OnInit, OnDestroy {
  constructor(
    private switcher: ComponentSwitcherDirective,
    private inviteUserModalService: InviteUserModalService,
    private frameworksFacade: FrameworksFacadeService,
    private pluginFacade: PluginFacadeService,
    private operationTrackingService: OperationsTrackerService,
    private customerFacade: CustomerFacadeService,
    private onboardingEventService: OnboardingUserEventService
  ) {}

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private contextData: OnboardingSharedContext;
  userInvited = false;
  tipTypes = TipTypeEnum;
  loading = false;

  ngOnInit(): void {
    this.getSwitcherContextData();

    this.operationTrackingService
      .getOperationStatus('user', TrackOperations.CREATE_USER)
      .pipe(take(1), this.detacher.takeUntilDetach())
      .subscribe((val) => (this.userInvited = true));
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `onboardingWizard.company.${relativeKey}`;
  }

  inviteUserClick(): void {
    this.inviteUserModalService.openInviteUserModal(InviteUserSource.OnboardingWizard);
  }

  onBackClick(): void {
    this.switcher.goById(OnboardingComponentIds.PolicyManaging);
  }

  async onDoneClick(): Promise<void> {
    this.loading = true;
    if (this.contextData.selectedFramework.length) {
      this.contextData.selectedFramework.forEach((framework) => {
        if (!framework.is_applicable) {
          this.frameworksFacade.adoptFrameworkAsync(framework);
        }
      });
    }
    if (this.contextData.selectedPlugins.length) {
      this.contextData.selectedPlugins.forEach((plugin) => this.pluginFacade.addPluginToFavorites(plugin.service_id));
    }

    await this.customerFacade.markCustomerAsOnboarded();
    this.onboardingEventService.trackFlowEndedEvent();
    this.switcher.goById(OnboardingComponentIds.Done);
    this.loading = false;
  }

  private async getSwitcherContextData(): Promise<void> {
    this.contextData = await this.switcher.sharedContext$
      .pipe(
        filter((c) => !!c),
        take(1)
      )
      .toPromise();
  }
}
