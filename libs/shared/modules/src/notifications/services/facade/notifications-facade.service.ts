import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ActionDispatcherService } from '../../../data/services/action-dispatcher/action-dispatcher.service';
import { Notification, NotificationState } from '../../models';
import {
  NotificationAdapterActions,
  selectAnyNewNotifications,
  selectNotifications,
  selectNotificationsCount,
  selectNotificationsLoaded,
} from '../../store';

@Injectable()
export class NotificationsFacadeService {
  notificationsCache$: Observable<Notification[]>;

  constructor(private store: Store<any>, private actionDispatcher: ActionDispatcherService) {
    this.notificationsCache$ = this.store.select(selectNotificationsLoaded).pipe(
      tap((areLoaded) => {
        if (!areLoaded) {
          this.store.dispatch(NotificationAdapterActions.load());
        }
      }),
      filter((areLoaded) => areLoaded),
      switchMap((_) => this.store.select(selectNotifications)),
      shareReplay()
    );
  }

  getAllNotifications(): Observable<Notification[]> {
    /** Retuens an observable list of all notifictions */
    return this.notificationsCache$;
  }

  getAreThereAnyNewNotifications(): Observable<boolean> {
    /** Retuens an observable of whether there are any unread notifictions */
    return this.store.select(selectAnyNewNotifications);
  }

  getNotificationsCount(): Observable<number> {
    /** Retuens an observable of whether there are any unread notifictions */
    return this.store.select(selectNotificationsCount);
  }

  loadLatest(timestamp: string): void {
    /** Loads latest notifications  */
    this.store.dispatch(NotificationAdapterActions.loadLatest({ timestamp }));
  }

  markAsSeen(id: string): void {
    /** Marks the gived notification id as seen */
    const notification: Notification = { id, state: NotificationState.Seen };
    this.store.dispatch(NotificationAdapterActions.update({ id, notification }));
  }

  remove(id?: string): void {
    /** Remvove notifications -
     * in case the id is undefined, it removes all notifications
     * else - only the specified one */
    this.store.dispatch(NotificationAdapterActions.remove({ id }));
  }
}
