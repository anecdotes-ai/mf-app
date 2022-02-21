import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { RemoveUserAction, UserCreatedAction, UsersAdapterActions, UsersLoadedAction, UserUpdatedAction } from '../actions';
import { User } from '../../models/domain';

export interface UsersState extends EntityState<User> {
  isLoaded: boolean;
}

function selectUserId(user: User): any {
  return user.email;
}

export function sortByName(a: User, b: User): number {
  return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: selectUserId,
  sortComparer: sortByName
});

const initialState: UsersState = usersAdapter.getInitialState({ isLoaded: false });

const adapterReducer = createReducer(
  initialState,
  on(UsersAdapterActions.usersLoaded, (state: UsersState, action: UsersLoadedAction) =>
    usersAdapter.upsertMany(action.payload, { ...state, isLoaded: true })
  ),
  on(UsersAdapterActions.userUpdated, (state: UsersState, action: UserUpdatedAction) => {
    return usersAdapter.upsertOne(action.user, state);
  }),
  on(UsersAdapterActions.userCreated, (state: UsersState, action: UserCreatedAction) => {
    return usersAdapter.addOne(action.payload, state);
  }),
  on(UsersAdapterActions.userRemoved, (state: UsersState, action: RemoveUserAction) => {
    return usersAdapter.removeOne(action.payload.email, state);
  })
);

export function usersReducer(state = initialState, action: Action): UsersState {
  return adapterReducer(state, action);
}
