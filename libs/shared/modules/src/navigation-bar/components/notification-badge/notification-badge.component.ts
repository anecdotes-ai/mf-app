import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NotificationsFacadeService } from 'core/modules/notifications/services';
import { Observable } from 'rxjs';
import { PositionX } from '../../models/navigation.model';

@Component({
  selector: 'app-notification-badge',
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBadgeComponent implements OnInit { 
  @Input() xPosition: PositionX;

  newNotifications$: Observable<boolean>;
  positionXEnum = PositionX;

  constructor(private notificationsFacade: NotificationsFacadeService) { }

  ngOnInit(): void {
    this.newNotifications$ = this.notificationsFacade.getAreThereAnyNewNotifications();
  }
}
