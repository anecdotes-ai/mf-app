import { OnboardingEventData, OnboardingDataProperty, UserEvents } from 'core/models/user-events/user-event-data.model';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { Injectable } from '@angular/core';

@Injectable(
  // TODO: Must be removed. Currently cannot be removed since it breaks lots of tests
  {
    providedIn: 'root' 
  }
)
export class OnboardingUserEventService {
  constructor(
    private userEventService: UserEventService
  ) { }

  trackFilesPoliciesChoosingEvent(chosenPoliciesNames: string[]): void
  {
    const eventData: OnboardingEventData = {
      [OnboardingDataProperty.FilesOrPolicies]: chosenPoliciesNames
    };
    this.userEventService.sendEvent(UserEvents.ONBOARDING_CHOOSING_FILES_POLICIES, eventData);
  }

  trackPluginsChoosingEvent(choosenPluginsNames: string[]): void
  {
    const eventData: OnboardingEventData = {
      [OnboardingDataProperty.Plugins]: choosenPluginsNames
    };
    this.userEventService.sendEvent(UserEvents.ONBOARDING_CHOOSING_PLUGINS, eventData);
  }

  trackFrameworkChoosingEvent(choosenFrameworkNames: string[]): void
  {
    const eventData: OnboardingEventData = {
      [OnboardingDataProperty.Frameworks]: choosenFrameworkNames
    };
    this.userEventService.sendEvent(UserEvents.ONBOARDING_RELEVANT_FRAMEWORKS, eventData);
  }

  trackPolicyChoosingEvent(isChosen: boolean): void
  {
    const eventData: OnboardingEventData = {
      [OnboardingDataProperty.Policies]: isChosen ? 'yes' : 'no'
    };
    this.userEventService.sendEvent(UserEvents.ONBOARDING_ORGANIZATIONS_POLICIES, eventData);
  }

  trackGetStartedEvent(): void
  {
    this.userEventService.sendEvent(UserEvents.ONBOARDING_GET_STARTED);
  }

  trackFlowEndedEvent(): void
  {
    this.userEventService.sendEvent(UserEvents.ONBOARDING_FLOW_ENDED);
  }
  
  trackNextStepEvent(destination: string): void {
    const eventData: OnboardingEventData = {
      [OnboardingDataProperty.Destination]: destination
    };
    this.userEventService.sendEvent(UserEvents.ONBOARDING_NEXT_STEP, eventData);
  }
}
