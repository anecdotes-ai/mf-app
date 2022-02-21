import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from 'core/modules/data/services/abstract-http/abstract-service';
import { AppConfigService } from 'core/services/config/app.config.service';
import { Observable } from 'rxjs';
import { Notification } from '../../models';

@Injectable()
export class NotificationsService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  }

  getNotifications(params?: {
    [param: string]: string | number | boolean | readonly (string | number | boolean)[];
  }): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      this.builNotificationsUrl((a) => a.getNotifications),
      {
        params,
      }
    );
  }

  getLatestNotifications(timestamp: string): Observable<Notification[]> {
    const params = {};
    if (timestamp) {
      params['timestamp'] = timestamp;
    }
    return this.getNotifications(params);
  }

  patchNotification(notification_id: string, patchedNotification: Notification): Observable<any> {
    return this.http.patch<Notification>(
      this.builNotificationsUrl((a) => a.patchNotification, { notification_id }),
      patchedNotification
    );
  }

  deleteNotification(notification_id?: string): Observable<any> {
    return notification_id
      ? this.http.delete(this.builNotificationsUrl((t) => t.deleteNotification, { notification_id }))
      : this.http.delete(this.builNotificationsUrl((t) => t.deleteAllNotifications));
  }
}
