import { createFeatureSelector, createSelector, State } from '@ngrx/store';
import { featureKey } from '../constants';
import { NoteFeatureState } from '../state';

const noteFeatureSelector = createFeatureSelector<NoteFeatureState>(featureKey);
export const selectNoteState = createSelector(noteFeatureSelector, noteFeatureState => noteFeatureState.noteState);