import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FrameworksEventService } from 'core/modules/data/services';
import { IntercomService } from 'core/services';

@Component({
  selector: 'app-create-framework-modal',
  templateUrl: './create-framework-modal.component.html',
  styleUrls: [
    './create-framework-modal.component.scss',
    '../../shared-framework-modal.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFrameworkModalComponent {
  constructor(private intercomService: IntercomService, private frameworkEventsService: FrameworksEventService) {}

  buildTranslationKey(key: string): string {
    return `frameworks.createFrameworkModal.${key}`;
  }

  contactUs(): void {
    this.frameworkEventsService.trackCreateFrameworkCtuClick();
    this.intercomService.showNewMessage();
  }
}
