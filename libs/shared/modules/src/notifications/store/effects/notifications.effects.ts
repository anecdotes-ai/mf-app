import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { NotificationsService } from '../../services';
import { NotificationAdapterActions } from '../actions';

@Injectable()
export class NotificationEffects {
  constructor(
    private actions$: Actions,
    private notificationsService: NotificationsService,
    private store: Store<any>
  ) {}

  loadNotifications$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationAdapterActions.load),
      take(1),
      mergeMap(() =>
        this.notificationsService
          .getNotifications()
          .pipe(map((notifications) => NotificationAdapterActions.loaded({ notifications })))
      )
    );
  });

  loadLatestNotifications$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationAdapterActions.loadLatest),
      mergeMap((action) => {
        return this.notificationsService
          .getLatestNotifications(action.timestamp)
          .pipe(map((notifications) => NotificationAdapterActions.loaded({ notifications })));
      })
    );
  });

  updateNotification$: Observable<Action> = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NotificationAdapterActions.update),
        tap((action) =>
          this.store.dispatch(NotificationAdapterActions.updated({ id: action.id, changes: action.notification }))
        ),
        mergeMap((action) => this.notificationsService.patchNotification(action.id, action.notification))
      );
    },
    { dispatch: false }
  );

  remove$: Observable<Action> = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NotificationAdapterActions.remove),
        tap((action) => this.store.dispatch(NotificationAdapterActions.removed({ id: action.id }))),
        mergeMap((action) => this.notificationsService.deleteNotification(action.id))
      );
    },
    { dispatch: false }
  );
}
