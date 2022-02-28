import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose } from '@ngrx/store';

export interface InitFeatureState {
  initState: t.InitState;
}

export const reducers: ActionReducerMap<InitFeatureState> = {
    initState: t.initReducers,
};

// tslint:disable-next-line:typedef
export function store(state: any, action: any): InitFeatureState {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
