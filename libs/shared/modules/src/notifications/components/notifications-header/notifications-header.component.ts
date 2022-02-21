import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notifications-header',
  templateUrl: './notifications-header.component.html',
  styleUrls: ['./notifications-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsHeaderComponent {
  @Input()
  notificationsCount = 0;

  @Output()
  clearAllClicked = new EventEmitter<any>();

  buildTranslationKey(relativeKey: string): string {
    return `notifications.panel.${relativeKey}`;
  }
}
