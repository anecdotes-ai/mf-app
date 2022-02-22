import { Component } from '@angular/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives/component-switcher/component-switcher.directive';
import { OnboardingComponentIds } from './../../constants/onboarding.constants';
import { OnboardingUserEventService } from '../../services/onboarding-user-event.service';

@Component({
  selector: 'app-onboarding-welcome',
  templateUrl: './onboarding-welcome.component.html',
  styleUrls: ['./onboarding-welcome.component.scss'],
})
export class OnboardingWelcomeComponent {
  constructor(private switcher: ComponentSwitcherDirective, private onboardingEventService: OnboardingUserEventService) {}

  buildTranslationKey(relativeKey: string): string {
    return `onboardingWizard.welcome.${relativeKey}`;
  }

  getStartedClick(): void {
    this.onboardingEventService.trackGetStartedEvent();
    this.switcher.goById(OnboardingComponentIds.Frameworks);
  }
}
