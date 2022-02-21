import { createAction, props } from '@ngrx/store';
import { FocusingResourcesMap } from '../../types';

export const FocusResourcesAction = createAction(
  '[FocusingMechanism] focus resources',
  props<{ focusingResourcesMap: FocusingResourcesMap }>()
);

export const FinishFocusingAction = createAction(
  `[FocusingMechanism] finish resource's focusing`,
  props<{ resourceName: string }>()
);
