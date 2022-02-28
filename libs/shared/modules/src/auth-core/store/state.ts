import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose, createFeatureSelector } from '@ngrx/store';

export const featureKey = 'auth';

export interface AuthState {
  userState: t.UsersState;
}

export const reducers: ActionReducerMap<AuthState> = {
  userState: t.usersReducer,
};

export const authStateFeatureSelector = createFeatureSelector<AuthState>(featureKey);

// tslint:disable-next-line:typedef
export function store(state: any, action: any): AuthState {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
