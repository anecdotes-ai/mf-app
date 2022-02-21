import { Action, createAction, props } from '@ngrx/store';
import { User } from '../../models/domain';

export const UserActionType = {
  CreateUser: '[User] Create user',

  UserCreated: '[User] User successfully created',

  UsersLoaded: '[Users] Users loaded',

  SpecificUserLoaded: '[Users] Specific User Loaded',

  UserUpdated: '[User] User updated',

  RemoveUser: '[User] Remove user',

  UserRemoved: '[User] User removed',

  ResendUserInvitation: '[User] Resend user invitation',
};

export class UserCreatedAction implements Action {
  readonly type = UserActionType.UserCreated;

  constructor(public payload: User) { }
}

export class CreateUserAction implements Action {
  readonly type = UserActionType.CreateUser;

  constructor(public payload: { user: User }) { }
}

export class UsersLoadedAction implements Action {
  readonly type = UserActionType.UsersLoaded;

  constructor(public payload: User[]) { }
}

export class ResendUserInvitationAction implements Action {
  readonly type = UserActionType.ResendUserInvitation;

  constructor(public user_email: string) { }
}

export class UserUpdatedAction implements Action {
  readonly type = UserActionType.UserUpdated;
  constructor(public user: User) { }
}

// Consider to remove this action as it handles inappropriate way
export class SpecificUserUpdatedAction implements Action {
  readonly type = UserActionType.UserUpdated;

  constructor(public payload: { email: string; changes: User }) { }
}

export class RemoveUserAction implements Action {
  readonly type = UserActionType.RemoveUser;

  constructor(public payload: { email: string }) { }
}

export class UserRemovedAction implements Action {
  readonly type = UserActionType.UserRemoved;

  constructor(public payload: { email: string }) { }
}

export const UsersAdapterActions = {
  usersLoaded: createAction(UserActionType.UsersLoaded, props<{ payload: User[] }>()),
  userUpdated: createAction(UserActionType.UserUpdated, props<{ user: User }>()),
  removeUser: createAction(UserActionType.RemoveUser, props<{ payload: { email: string } }>()),
  userRemoved: createAction(UserActionType.UserRemoved, props<{ payload: { email: string } }>()),
  createUser: createAction(UserActionType.CreateUser, props<{ payload: { user: User } }>()),
  userCreated: createAction(UserActionType.UserCreated, props<{ payload: User }>()),
};
