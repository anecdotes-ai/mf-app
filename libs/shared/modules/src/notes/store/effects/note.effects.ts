import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Note } from '../../models/domain';
import { ResourceType } from 'core/modules/data/models';
import { OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
import { EMPTY } from 'rxjs';
import { catchError, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { NoteService } from '../../services/note-service/note.service';
import { NoteActions } from '../actions';
import { selectNoteState } from '../selectors';
import { buildNoteId } from '../utils';
import {
  AddNoteAction,
  DeleteNoteAction,
  EditNoteAction,
  LoadNoteAction,
  NoteAddedAction,
  NoteDeletedAction,
  NoteEditedAction,
  NoteLoadedAction,
} from './../actions';
import { BatchControlsUpdatedAction, BatchPolicyUpdatedAction, ControlRequirementBatchUpdatedAction } from 'core/modules/data/store/actions';
import { Action } from '@ngrx/store';
@Injectable()
export class NoteEffects {
  constructor(
    private actions$: Actions,
    private noteService: NoteService,
    private operationsTrackerService: OperationsTrackerService,
    private store: Store
  ) {}

  @Effect()
  addNote$ = this.actions$.pipe(
    ofType(NoteActions.AddNote),
    mergeMap((action: AddNoteAction) =>
      this.noteService.addNote(action.noteToAdd).pipe(map((response) => ({ response, action })))
    ),
    mergeMap((accumulatedResult) => {
      return [
        new NoteAddedAction({
          ...accumulatedResult.response,
          resource_type: accumulatedResult.action.noteToAdd.resource_type,
          resource_id: accumulatedResult.action.noteToAdd.resource_id,
        }),
        this.getResourceNoteExistenceUpdateAction(accumulatedResult.action.noteToAdd, true),
      ];
    }),
    tap(() => {
      this.operationsTrackerService.trackSuccess(TrackOperations.ADD_REQUIREMENT_NOTE);
    }),
    catchError((err) => {
      this.operationsTrackerService.trackError(TrackOperations.ADD_REQUIREMENT_NOTE, err);
      return EMPTY;
    })
  );

  @Effect()
  loadNote$ = this.actions$.pipe(
    ofType(NoteActions.LoadNote),
    map((action) => action as LoadNoteAction),
    withLatestFrom(this.store.select(selectNoteState)),
    filter(([action, state]) => !state.entities[buildNoteId(action.resource_type, action.resource_id)]), // We shouldn't try to load note that placeholder has already been created for in state
    map(([action]) => action),
    mergeMap((action: LoadNoteAction) =>
      this.noteService.getNote(action.resource_type, action.resource_id).pipe(map((response) => ({ response, action })))
    ),
    tap(() => {
      this.operationsTrackerService.trackSuccess(TrackOperations.LOAD_REQUIREMENT_NOTE);
    }),
    map(
      (accumulatedResult) =>
        new NoteLoadedAction(
          accumulatedResult.action.resource_type,
          accumulatedResult.action.resource_id,
          accumulatedResult.response
        )
    ),
    catchError((err) => {
      this.operationsTrackerService.trackError(TrackOperations.LOAD_REQUIREMENT_NOTE, err);
      return EMPTY;
    })
  );

  @Effect()
  editNote$ = this.actions$.pipe(
    ofType(NoteActions.EditNote),
    mergeMap((action: EditNoteAction) =>
      this.noteService.updateNote(action.noteToEdit).pipe(map((response) => ({ response, action })))
    ),
    tap(() => {
      this.operationsTrackerService.trackSuccess(TrackOperations.UPDATE_REQUIREMENT_NOTE);
    }),
    map(
      (accumulatedResult) =>
        new NoteEditedAction({
          ...accumulatedResult.response,
          resource_type: accumulatedResult.action.noteToEdit.resource_type,
          resource_id: accumulatedResult.action.noteToEdit.resource_id,
        })
    ),
    catchError((err) => {
      this.operationsTrackerService.trackError(TrackOperations.UPDATE_REQUIREMENT_NOTE, err);
      return EMPTY;
    })
  );

  @Effect({ dispatch: false })
  deleteNote$ = this.actions$.pipe(
    ofType(NoteActions.DeleteNote),
    tap((action: DeleteNoteAction) => {
      this.store.dispatch(new NoteDeletedAction(action.noteToDelete));
      this.store.dispatch(this.getResourceNoteExistenceUpdateAction(action.noteToDelete, false));
    }),
    mergeMap((action: DeleteNoteAction) =>
      this.noteService.deleteNote(action.noteToDelete).pipe(
        map(() => action),
        catchError((err) => {
          this.store.dispatch(new NoteAddedAction(action.noteToDelete));
          this.operationsTrackerService.trackError(TrackOperations.DELETE_REQUIREMENT_NOTE, err);
          return EMPTY;
        })
      )
    ),
    tap(() => {
      this.operationsTrackerService.trackSuccess(TrackOperations.DELETE_REQUIREMENT_NOTE);
    })
  );

  private getResourceNoteExistenceUpdateAction(note: Note, noteExist: boolean): Action {
    switch (note.resource_type) {
      case ResourceType.Requirement: {
        return new ControlRequirementBatchUpdatedAction([
          { requirement_id: note.resource_id, requirement_note_exists: noteExist },
        ]);
      }
      case ResourceType.Control: {
        return new BatchControlsUpdatedAction([
          { control_id: note.resource_id, control_note_exists: noteExist },
        ]);
      }
      case ResourceType.Policy: {
        return new BatchPolicyUpdatedAction([
          { policy_id: note.resource_id, note_exists: noteExist },
        ]);
      }
    }
  }
}
