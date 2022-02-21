import { OnboardingComponentIds } from './../../../onboarding/constants';
import { Framework } from 'core/modules/data/models/domain';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { LoaderManagerService } from 'core/services/loader-manager/loader-manager.service';
import { CustomerFacadeService, FrameworksFacadeService } from 'core/modules/data/services/facades';
import { OnboardingPolicyManagingComponent } from './../../../onboarding/components/onboarding-policy-managing/onboarding-policy-managing.component';
import { OnboardingSharedContext } from './../../../onboarding/models/onboarding-shared-context.model';
import { OnboardingDoneComponent } from './../../../onboarding/components/onboarding-done/onboarding-done.component';
import { OnboardingCompanyComponent } from './../../../onboarding/components/onboarding-company/onboarding-company.component';
import { OnboardingPolicyComponent } from './../../../onboarding/components/onboarding-policy/onboarding-policy.component';
import { OnboardingPluginsComponent } from './../../../onboarding/components/onboarding-plugins/onboarding-plugins.component';
import { OnboardingFrameworksComponent } from './../../../onboarding/components/onboarding-frameworks/onboarding-frameworks.component';
import { OnboardingWelcomeComponent } from './../../../onboarding/components/onboarding-welcome/onboarding-welcome.component';
import { ComponentSwitcherDirective, ComponentToSwitch } from 'core/modules/component-switcher';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit, OnDestroy {
  constructor(
    private loaderManager: LoaderManagerService,
    private frameworksFacade: FrameworksFacadeService,
    private customerFacade: CustomerFacadeService
  ) {}

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  frameworksStream$: Observable<Framework[]>;
  isOnBoarded = false;

  @ViewChild('switcherRef')
  private swithcerDir: ComponentSwitcherDirective;

  async ngOnInit(): Promise<void> {
    this.isOnBoarded = await this.customerFacade.getCurrentCustomerIsOnboarded().pipe(take(1)).toPromise();
    if (!this.isOnBoarded) {
      this.loaderManager.show();
      this.frameworksStream$ = this.frameworksFacade.getFrameworks();
      this.frameworksStream$.pipe(take(1), this.detacher.takeUntilDetach()).subscribe(() => {
        this.loaderManager.hide();
      });
    } else {
      this.swithcerDir.goById(OnboardingComponentIds.Done);
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.loaderManager.hide();
  }

  buildTranslationKey(relativeKey: string): string {
    return `welcomePage.${relativeKey}`;
  }

  onboardingWindowsQueue: ComponentToSwitch[] = [
    {
      id: OnboardingComponentIds.Welcome,
      componentType: OnboardingWelcomeComponent,
    },
    {
      id: OnboardingComponentIds.Frameworks,
      componentType: OnboardingFrameworksComponent,
    },
    {
      id: OnboardingComponentIds.Plugins,
      componentType: OnboardingPluginsComponent,
    },
    {
      id: OnboardingComponentIds.Policy,
      componentType: OnboardingPolicyComponent,
    },
    {
      id: OnboardingComponentIds.PolicyManaging,
      componentType: OnboardingPolicyManagingComponent,
    },
    {
      id: OnboardingComponentIds.Company,
      componentType: OnboardingCompanyComponent,
    },
    {
      id: OnboardingComponentIds.Done,
      componentType: OnboardingDoneComponent,
    },
  ];

  onboardingWindowsSharedContext: OnboardingSharedContext = { selectedFramework: [], selectedPlugins: [] };
}
