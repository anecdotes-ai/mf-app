import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose } from '@ngrx/store';

export interface NoteFeatureState {
  noteState: t.NoteState;
}

export const reducers: ActionReducerMap<NoteFeatureState> = {
    noteState: t.noteReducer,
};

// tslint:disable-next-line:typedef
export function store(state: any, action: any): NoteFeatureState {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
