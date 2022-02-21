import { Action, createReducer, on } from '@ngrx/store';
import { FocusResourcesAction, FinishFocusingAction } from '../actions';
import { FocusingResourcesMap } from '../../types';

export interface FocusingState {
  focusedResources: FocusingResourcesMap;
}

const initialState: FocusingState = {
  focusedResources: {},
};

const reducer = createReducer<FocusingState>(
  initialState,
  on(FocusResourcesAction, (state, action) => {
    return {
      ...state,
      focusedResources: { ...state.focusedResources, ...action.focusingResourcesMap },
    };
  }),
  on(FinishFocusingAction, (state, action) => {
    const copy = { ...state.focusedResources };
    delete copy[action.resourceName];

    return {
      ...state,
      focusedResources: copy,
    };
  })
);

export function focusingReduser(state = initialState, action: Action): FocusingState {
  return reducer(state, action);
}
