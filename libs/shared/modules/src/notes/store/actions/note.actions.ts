import { Action, createAction, props } from '@ngrx/store';
import { Note } from '../../models/domain';
import { ResourceType } from 'core/modules/data/models';

export const NoteActions = {
  AddNote: '[Note] Add note',
  NoteAdded: '[Note] Note added',

  EditNote: '[Note] Edit note',
  NoteEdited: '[Note] Note Edited',

  DeleteNote: '[Note] Delete note',
  NoteDeleted: '[Note] Note deleted',

  LoadNote: '[Note] Load note',
  NoteLoaded: '[Note] Note Loaded',
};

// LOAD
export class LoadNoteAction implements Action {
  readonly type = NoteActions.LoadNote;

  constructor(public resource_type: ResourceType, public resource_id: string) {}
}

export class NoteLoadedAction implements Action {
  readonly type = NoteActions.NoteLoaded;

  constructor(public resource_type: ResourceType, public resource_id: string, public note: Note) {}
}

// ADD
export class AddNoteAction implements Action {
  readonly type = NoteActions.AddNote;

  constructor(public noteToAdd: Note) {}
}

export class NoteAddedAction implements Action {
  readonly type = NoteActions.NoteAdded;

  constructor(public addedNote: Note) {}
}

// EDIT
export class EditNoteAction implements Action {
  readonly type = NoteActions.EditNote;

  constructor(public noteToEdit: Note) {}
}

export class NoteEditedAction implements Action {
  readonly type = NoteActions.NoteEdited;

  constructor(public editedNote: Note) {}
}

// DELETE
export class DeleteNoteAction implements Action {
  readonly type = NoteActions.DeleteNote;

  constructor(public noteToDelete: Note) {}
}

export class NoteDeletedAction implements Action {
  readonly type = NoteActions.NoteDeleted;

  constructor(public deletedNote: Note) {}
}

// ** NOTES ADAPTER - used by the reducer **

export const NoteAdapterActions = {
  noteDeleted: createAction(NoteActions.NoteDeleted, props<{ deletedNote: Note }>()),
  noteLoaded: createAction(
    NoteActions.NoteLoaded,
    props<{ resource_type: ResourceType; resource_id: string; note: Note }>()
  ),
  noteEdited: createAction(NoteActions.NoteEdited, props<{ editedNote: Note }>()),
  noteAdded: createAction(NoteActions.NoteAdded, props<{ addedNote: Note }>()),
};
