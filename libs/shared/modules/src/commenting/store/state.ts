import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose } from '@ngrx/store';
export const featureKey = 'commenting-panel';

export interface CommentingFeatureState {
  commentingPanelState: t.CommentingPanelState;
}

export const reducers: ActionReducerMap<CommentingFeatureState> = {
  commentingPanelState: t.commentingPanelReducer,
};

export function store(state: any, action: any): CommentingFeatureState {
  const actionReducer = compose(combineReducers)(reducers);
  return actionReducer(state, action);
}
