import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Note } from '../../models/domain';
import { ResourceType } from 'core/modules/data/models';
import { NoteAdapterActions } from './../actions';
import { buildNoteId } from '../utils';

function selectNoteId(note: ResourcePlaceholder): string {
  return buildNoteId(note.resource_type, note.resource_id);
}

function createNoteStateEntityFromNote(
  resource_type: ResourceType,
  resource_id: string,
  note: Note
): ResourcePlaceholder {
  return {
    resource_type,
    resource_id,
    note,
  };
}

export interface ResourcePlaceholder {
  resource_type: ResourceType;
  resource_id: string;
  note: Note;
}

export type NoteState = EntityState<ResourcePlaceholder>;

const notesAdapter = createEntityAdapter<ResourcePlaceholder>({
  selectId: selectNoteId,
});

const initialState = notesAdapter.getInitialState();

const adapterReducer = createReducer(
  initialState,
  on(NoteAdapterActions.noteLoaded, (state: NoteState, action) => {
    return notesAdapter.addOne(
      createNoteStateEntityFromNote(action.resource_type, action.resource_id, action.note),
      state
    );
  }),
  on(NoteAdapterActions.noteAdded, (state: NoteState, action) => {
    return notesAdapter.upsertOne(
      // upsert is used because placeholder may already be added
      createNoteStateEntityFromNote(action.addedNote.resource_type, action.addedNote.resource_id, action.addedNote),
      state
    );
  }),
  on(NoteAdapterActions.noteDeleted, (state: NoteState, action) => {
    return updateNotePlaceholder(action.deletedNote.resource_type, action.deletedNote.resource_id, null, state);
  }),
  on(NoteAdapterActions.noteEdited, (state: NoteState, action) => {
    return updateNotePlaceholder(
      action.editedNote.resource_type,
      action.editedNote.resource_id,
      action.editedNote,
      state
    );
  })
);

export function noteReducer(state = initialState, action: Action): NoteState {
  return adapterReducer(state, action);
}

function updateNotePlaceholder(resource_type: ResourceType, resource_id: string, note: Note, state: NoteState): NoteState {
  const noteStateEntity = createNoteStateEntityFromNote(resource_type, resource_id, note);

  return notesAdapter.updateOne(
    // It's done on purpose. We don't need to remove placeholder for resource
    {
      id: selectNoteId(noteStateEntity),
      changes: noteStateEntity,
    },
    state
  );
}
