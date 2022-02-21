import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Notification, NotificationResourceType, NotificationState } from 'core/modules/notifications/models';
import { NotificationsFacadeService } from 'core/modules/notifications/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { sortByDate } from 'core/utils';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsListComponent implements OnInit {
  notifications$: Observable<Notification[]>;
  notificationResourceType = NotificationResourceType;

  constructor(private notificationsFacade: NotificationsFacadeService) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationsFacade
      .getAllNotifications()
      .pipe(map((notifications) => sortByDate(notifications, 'creation_time')));
  }

  buildTranslationKey(relativeKey: string): string {
    return `notifications.panel.${relativeKey}`;
  }

  selectNotificationId(notification: Notification): string {
    return notification?.id;
  }

  isComment(notification: Notification): boolean {
    return (
      notification.data?.resource_type === NotificationResourceType.Comment ||
      notification.data?.resource_type === NotificationResourceType.Thread
    );
  }

  notificationRemoved(id: string): void {
    this.notificationsFacade.remove(id);
  }

  async notificationClicked(notification: Notification): Promise<void> {
    if (notification.state === NotificationState.New) {
      await this.notificationsFacade.markAsSeen(notification.id);
    }
  }
}
