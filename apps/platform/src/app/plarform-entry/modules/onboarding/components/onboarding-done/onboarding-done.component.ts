import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { OnBoardingNextDestination } from 'core/models/user-events/user-event-data.model';
import { AppRoutes } from 'core/constants';
import { IntercomService } from 'core/services';
import { OnboardingUserEventService } from '../../services/onboarding-user-event.service';

@Component({
  selector: 'app-onboarding-done',
  templateUrl: './onboarding-done.component.html',
  styleUrls: ['./onboarding-done.component.scss'],
})
export class OnboardingDoneComponent {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private intercomService: IntercomService,
    private router: Router,
    private onboardingEventService: OnboardingUserEventService
  ) {}

  buildTranslationKey(relativeKey: string): string {
    return `onboardingWizard.done.${relativeKey}`;
  }

  onPolicyClick(): void {
    this.onboardingEventService.trackNextStepEvent(OnBoardingNextDestination.Policy);
    this.router.navigate([AppRoutes.PolicyManager]);
  }

  onPluginsMarketClick(): void {
    this.onboardingEventService.trackNextStepEvent(OnBoardingNextDestination.Plugins);
    this.router.navigate([AppRoutes.Plugins]);
  }

  onIntercomClick(): void {
    this.intercomService.openMessanger();
  }
}
