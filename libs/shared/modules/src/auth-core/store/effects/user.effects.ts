import { UserRemovedAction } from './../actions/user.actions';
import { userStateSelector } from './../state';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { UserStatus } from 'core/models/user-status';
import { OperationsTrackerService } from 'core/modules/data/services/operations-tracker/operations-tracker.service';
import { TrackOperations } from 'core/modules/data/services/operations-tracker/constants/track.operations.list.constant';
import { State } from 'core/modules/data/store';
import { NEVER, Observable } from 'rxjs';
import { catchError, map, mergeMap, tap, switchMap, take } from 'rxjs/operators';
import { User } from '../../models/domain';
import { UserService } from '../../services';
import {
  CreateUserAction,
  RemoveUserAction,
  ResendUserInvitationAction,
  UserActionType,
  UserCreatedAction,
  UserUpdatedAction
} from '../actions';

@Injectable()
export class UserEffects {
  constructor(
    private usersHttpService: UserService,
    private actions$: Actions,
    private store: Store<State>,
    private operationsTrackerService: OperationsTrackerService
  ) { }

  @Effect({ dispatch: false })
  removeSpecificUser$: Observable<User> = this.actions$.pipe(
    ofType(UserActionType.RemoveUser),
    mergeMap((action: RemoveUserAction) => {
      return this.store.select(userStateSelector).pipe(map((state) => state.entities[action.payload.email]), take(1)).pipe(switchMap((user) => {
        this.store.dispatch(new UserRemovedAction({ email: action.payload.email }));
        return this.usersHttpService.removeSpecificUser(action.payload.email).pipe(
          tap(() => this.operationsTrackerService.trackSuccess(action.payload.email, TrackOperations.REMOVE_USER)),
          catchError((err) => {
            this.operationsTrackerService.trackError(action.payload.email, new Error(err), TrackOperations.REMOVE_USER);
            this.store.dispatch(new UserUpdatedAction(user));
            return NEVER;
          })
        );
      }));
    })
  );

  @Effect()
  createUser$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionType.CreateUser),
    mergeMap((action: CreateUserAction) => {
      return this.usersHttpService.createNewUser(action.payload.user).pipe(
        map((createdUser) => {
          this.operationsTrackerService.trackSuccess('user', TrackOperations.CREATE_USER);

          return new UserCreatedAction({
            ...action.payload.user,
            last_login: null,
            status: UserStatus.PROVISIONED,
          });
        }),
        catchError((err) => {
          this.operationsTrackerService.trackError('user', err, TrackOperations.CREATE_USER);
          return NEVER;
        })
      );
    })
  );

  @Effect({ dispatch: false })
  resendUserInvitation$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionType.ResendUserInvitation),
    mergeMap((action: ResendUserInvitationAction) => {
      return this.usersHttpService.updateUser(action.user_email).pipe(
        tap(() => this.operationsTrackerService.trackSuccess(action.user_email, TrackOperations.UPDATE_USER)),
        catchError((err) => {
          this.operationsTrackerService.trackError(action.user_email, new Error(err), TrackOperations.UPDATE_USER);
          return NEVER;
        })
      );
    })
  );

  @Effect({ dispatch: false })
  userUpdated$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionType.UserUpdated),
    mergeMap((action: UserUpdatedAction) => {
      return this.usersHttpService.updateUser(action.user.email).pipe(
        tap(() => this.operationsTrackerService.trackSuccess(action.user.email, TrackOperations.UPDATE_USER)),
        catchError((err) => {
          this.operationsTrackerService.trackError(action.user.email, new Error(err), TrackOperations.UPDATE_USER);
          return NEVER;
        })
      );
    })
  );
}
