import { State } from '@ngrx/store';
import { featureKey } from '../constants';
import { NoteState } from '../reducers';

export function selectNoteState(state: State<any>): NoteState {
  return state[featureKey].noteState;
}
