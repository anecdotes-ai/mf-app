import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NotificationsEventsService, NotificationsFacadeService } from '../../services';

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPanelComponent implements OnInit {
  notificationsCount$: Observable<number>;

  constructor(
    private notificationsFacade: NotificationsFacadeService,
    private eventsService: NotificationsEventsService
  ) {}

  ngOnInit(): void {
    this.notificationsCount$ = this.notificationsFacade.getNotificationsCount();
  }

  async clearAll(): Promise<void> {
    const notifications = await this.notificationsFacade.getAllNotifications().pipe(take(1)).toPromise();
    this.eventsService.trackNotificationsClearAll(notifications);
    this.notificationsFacade.remove();
  }
}
