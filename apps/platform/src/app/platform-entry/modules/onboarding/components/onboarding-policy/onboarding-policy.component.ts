import { OnboardingUserEventService } from './../../services/onboarding-user-event.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { RadioButtonModel } from 'core/models/radio-button.model';
import { TipTypeEnum } from 'core/models/tip.model';
import { OnboardingComponentIds } from './../../constants/onboarding.constants';

@Component({
  selector: 'app-onboarding-policy',
  templateUrl: './onboarding-policy.component.html',
  styleUrls: ['./onboarding-policy.component.scss'],
})
export class OnboardingPolicyComponent {
  constructor(
    private switcher: ComponentSwitcherDirective,
    private onboardingUserEventService: OnboardingUserEventService
  ) {}

  radioButtons: RadioButtonModel[] = [
    { id: 'yesBtn', value: true, label: this.buildTranslationKey('radioButtons.yes') },
    { id: 'noBtn', value: false, label: this.buildTranslationKey('radioButtons.no') },
  ];

  buttonControl = new FormControl();
  tipTypes = TipTypeEnum;

  formGroup = new FormGroup({
    buttonsControl: this.buttonControl,
  });

  buildTranslationKey(relativeKey: string): string {
    return `onboardingWizard.policy.${relativeKey}`;
  }

  onNextClick(): void {
    this.switcher.goById(OnboardingComponentIds.PolicyManaging);
    this.onboardingUserEventService.trackPolicyChoosingEvent(this.formGroup.controls.buttonsControl.value);
  }

  onSkipClick(): void {
    this.switcher.goById(OnboardingComponentIds.Company);
    this.onboardingUserEventService.trackPolicyChoosingEvent(this.formGroup.controls.buttonsControl.value);
  }

  onBackClick(): void {
    this.switcher.goById(OnboardingComponentIds.Plugins);
  }
}
