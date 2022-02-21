import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  focusedReplyIdQueryParam,
  focusedThreadIdQueryParam,
} from 'core/modules/commenting/store/effects/focusing-inputs.effects';
import { Notification, NotificationResourceType } from '../../models';
@Component({
  selector: 'app-comment-notification',
  templateUrl: './comment-notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentNotificationComponent implements OnChanges {
  @Input() notification: Notification;
  @Output() removed = new EventEmitter<any>();
  @Output() clicked = new EventEmitter<any>();

  path: string;
  icon = 'notifications/comment';

  get isThread(): boolean {
    return this.notification.data?.resource_type === NotificationResourceType.Thread;
  }

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('notification' in changes) {
      this.path = this.notification.data?.extraParams?.path?.join(' > ');
    }
  }

  async onClick(): Promise<void> {
    this.clicked.emit();
    await this.navigateToComment();
  }

  private async navigateToComment(): Promise<void> {
    const url = decodeURI(this.notification.data?.extraParams?.url.replace(location.origin, ''));
    const queryParams = {
      [this.isThread ? focusedThreadIdQueryParam : focusedReplyIdQueryParam]: this.notification?.data?.resource_id,
    };
    await this.router.navigate([url], { queryParams, });
  }
}
