import { Component, Input } from '@angular/core';
import { IntercomService } from 'core/services';
import { Framework } from 'core/modules/data/models/domain';
import { BadgeColorTypes } from '../models';

@Component({
  selector: 'app-exclusive-framework-adoption',
  templateUrl: './exclusive-framework-adoption.component.html',
  styleUrls: ['./exclusive-framework-adoption.component.scss'],
})
export class ExclusiveFrameworkAdoptionComponent {
  badgeColorTypes = BadgeColorTypes;

  @Input()
  frameworks: Framework[];

  constructor(private intercom: IntercomService) {}

  contactUs(): void {
    this.intercom.showNewMessage();
  }

  buildTranslationKey(relativeKey: string): string {
    return `controls.emptyState.${relativeKey}`;
  }
}
