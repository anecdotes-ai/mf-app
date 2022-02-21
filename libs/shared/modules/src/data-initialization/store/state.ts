import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose } from '@ngrx/store';

export interface State {
  initState: t.InitState;
}

export const reducers: ActionReducerMap<State> = {
    initState: t.initReducers,
};

// tslint:disable-next-line:typedef
export function store(state: any, action: any): State {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
