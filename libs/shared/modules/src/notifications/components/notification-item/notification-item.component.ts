import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { NotificationsEventsService } from '../../services';
import { ShortDate } from 'core/constants/date';
import { Notification, NotificationState } from '../../models';
import { removeAnimation } from '../animations';

export const animationDelay = 200;
@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [removeAnimation],
})
export class NotificationItemComponent {
  @Output() clicked = new EventEmitter<any>();
  @Output() removed = new EventEmitter<any>();

  @HostBinding('@removeAnimation')
  get isRemoved(): boolean {
    return this.removalState;
  }

  @HostBinding('class.group')
  @Input()
  notification: Notification;
  @Input() icon = 'notification';
  @Input() path: string;
  @HostBinding('class.unread')
  get unread(): boolean {
    return this.notification.state === NotificationState.New;
  }

  @HostListener('click') async onClick(): Promise<void> {
    this.eventsService.trackNotificationClick(
      this.notification.type,
      this.path,
      this.notification.data.resource_type,
      this.notification.state
    );
    this.clicked.emit();
  }

  shortDate = ShortDate;
  removalState = false;

  constructor(private eventsService: NotificationsEventsService) {}

  remove(event: MouseEvent): void {
    this.removalState = true;
    setTimeout(() => this.removed.emit(), animationDelay);
    this.eventsService.trackNotificationRemoval(
      this.notification.type,
      this.path,
      this.notification.data.resource_type,
      this.notification.state
    );
    event.stopPropagation();
  }
}
