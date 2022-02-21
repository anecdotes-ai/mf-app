import { Component, Input } from '@angular/core';
import { BadgeColorTypes } from '../models';

@Component({
  selector: 'app-onboarding-card',
  templateUrl: './onboarding-card.component.html',
  styleUrls: ['./onboarding-card.component.scss'],
})
export class OnboardingCardComponent {
  @Input()
  colorType: BadgeColorTypes;

  @Input()
  badgeTranslationKey: string;

  @Input()
  headerTranslationKey: string;

  @Input()
  subheaderTranslationKey: string;

  @Input()
  empty = false;

  get badgeColorClass(): string {
    switch (this.colorType) {
      case BadgeColorTypes.PINK:
        return 'pink';
      case BadgeColorTypes.ORANGE:
        return 'orange';
      default:
        return '';
    }
  }
}
