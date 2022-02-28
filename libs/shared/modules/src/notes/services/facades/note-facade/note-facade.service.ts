import { Injectable } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { ResourceData } from '../../../models';
import { ActionDispatcherService, ControlsFacadeService, PoliciesFacadeService, RequirementsFacadeService, TrackOperations } from 'core/modules/data/services';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Note } from '../../../models/domain';
import { ResourceType } from 'core/modules/data/models';
import { AddNoteAction, DeleteNoteAction, EditNoteAction, LoadNoteAction } from '../../../store/actions';
import { selectNoteState } from '../../../store/selectors';
import { buildNoteId } from '../../../store/utils';

@Injectable()
export class NoteFacadeService {
  constructor(
    private store: Store,
    private actionDispatcher: ActionDispatcherService,
    private requirementFacade: RequirementsFacadeService,
    private controlsFacade: ControlsFacadeService,
    private policyFacade: PoliciesFacadeService
  ) {}

  getNote(resource_type: ResourceType, resource_id: string): Observable<Note> {
    return this.store
      .select(selectNoteState)
      .pipe(
        map(noteState => noteState.entities[buildNoteId(resource_type, resource_id)]),
        tap((resourcePlaceholder) => {
          if (!resourcePlaceholder) {
            // if there is no resource placeholder in store we have to try to fetch note for the given resource
            this.fetchNote(resource_type, resource_id);
          }
        }),
        filter((resourcePlaceholder) => !!resourcePlaceholder),
        map((resourcePlaceholder) => resourcePlaceholder.note)
      );
  }

  getResourceData(resource_type: ResourceType, resource_id: string): Observable<ResourceData> {
    switch (resource_type) {
      case ResourceType.Requirement: {
        return this.requirementFacade
          .getRequirement(resource_id)
          .pipe(filter(requirement => !!requirement), map((req) => ({ noteExists: req.requirement_note_exists, title: req.requirement_name })));
      }
      case ResourceType.Control: {
        return this.controlsFacade
        .getControl(resource_id)
        .pipe(filter(control => !!control), map((control) => ({ noteExists: control.control_note_exists, title: control.control_name, category: control.control_category })));
      }
      case ResourceType.Policy: {
        return this.policyFacade
        .getPolicy(resource_id)
        .pipe(filter(policy => !!policy), map((policy) => ({ noteExists: policy.note_exists, title: policy.policy_name })));
      }
    }
  }

  private fetchNote(resource_type: ResourceType, resource_id: string): void {
    this.store.dispatch(new LoadNoteAction(resource_type, resource_id));
  }

  removeNote(noteToDelete: Note): void {
    this.store.dispatch(new DeleteNoteAction(noteToDelete));
  }

  async addNoteAsync(noteToAdd: Note): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      new AddNoteAction(noteToAdd),
      TrackOperations.ADD_REQUIREMENT_NOTE
    );
  }

  async editNoteAsync(noteToEdit: Note): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      new EditNoteAction(noteToEdit),
      TrackOperations.UPDATE_REQUIREMENT_NOTE
    );
  }
}
