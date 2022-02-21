import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { ApiDateFormat, ApiTimeZone } from 'core/constants';
import { AuthService } from 'core/modules/auth-core/services';
import { removeItemFromList } from 'core/utils';
import { EMPTY, forkJoin, from, NEVER, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { Control } from '../../models/domain';
import { ControlsService, OperationsTrackerService, TrackOperations } from '../../services';
import {
  BatchControlsUpdateAction,
  BatchControlsUpdatedAction,
  ControlActionType,
  ControlsReloadedAction,
  CustomControlRemovedAction,
  RemoveCustomControlAction,
  RequirementAddedAction,
  RequirementRemovedAction,
  RequirementsActionType,
  UpdateControlAction,
} from '../actions';
import { State } from '../state';
import { ControlsState } from '../reducers';
import {
  AddCustomControlAction,
  ControlAdapterActions,
  ControlApplicabilityBatchChangeAction,
  CustomControlAddedAction,
  EditCustomControlAction,
  UpdateControlOwnerAction,
  ControlOwnerUpdatedAction
} from './../actions/controls.actions';
import { CustomControlFormData } from '../../services/controls/models/add-customer-control.model';

@Injectable()
export class ControlEffects {
  constructor(
    private actions$: Actions,
    private controlsHttpService: ControlsService,
    private store: Store<State>,
    private operationsTrackerService: OperationsTrackerService,
    private authService: AuthService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  @Effect()
  reloadControls$: Observable<Action> = this.actions$.pipe(
    ofType(ControlActionType.ReloadControls),
    mergeMap(() =>
      this.controlsHttpService.getControls().pipe(
        tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.RELOAD_CONTROLS)),
        catchError((err) => {
          this.operationsTrackerService.trackError(TrackOperations.RELOAD_CONTROLS, new Error(err));
          return NEVER;
        })
      )
    ),

    map((resp) => {
      return new ControlsReloadedAction(resp);
    })
  );

  @Effect()
  updateControl$: Observable<Action> = this.actions$.pipe(
    ofType(ControlActionType.UpdateControl),
    mergeMap((action: UpdateControlAction) => {
      return this.controlsHttpService.getControl(action.controlId).pipe(
        tap(() => this.operationsTrackerService.trackSuccess(action.controlId, TrackOperations.UPDATE_CONTROLS)),
        catchError((err) => {
          this.operationsTrackerService.trackError(action.controlId, new Error(err), TrackOperations.UPDATE_CONTROLS);
          return EMPTY;
        })
      );
    }),
    map((control) => {
      return new BatchControlsUpdatedAction([control]);
    })
  );

  @Effect({ dispatch: false })
  updateControlStatus$: Observable<Action> = this.actions$.pipe(
    ofType(ControlAdapterActions.updateControlStatus),
    tap((action) => this.store.dispatch(ControlAdapterActions.batchControlsUpdated({ batch: [{control_id: action.controlId, control_status: action.newStatus}] }))),
    mergeMap((action) => {
      return this.controlsHttpService.patchControl(action.controlId, {control_status: action.newStatus}).pipe(
        tap(() =>
          this.operationsTrackerService.trackSuccess(action.controlId, TrackOperations.UPDATE_CUSTOM_CONTROL_STATUS)
        ),
        catchError((err) => {
          this.operationsTrackerService.trackError(
            action.controlId,
            new Error(err),
            TrackOperations.UPDATE_CUSTOM_CONTROL_STATUS
          );
          this.store.dispatch(ControlAdapterActions.batchControlsUpdated({ batch: [{control_id: action.controlId, control_status: action.oldStatus}] }));
          return EMPTY;
        })
      );
    })
  );
  
  @Effect()
  updateControlOwner$: Observable<Action> = this.actions$.pipe(
    ofType(ControlActionType.UpdateControlOwner),
    mergeMap((action: UpdateControlOwnerAction) => {
      return (
        this.controlsHttpService.patchControl(action.controlId, {control_owner: action.owner}).pipe(
          tap(() =>
            this.operationsTrackerService.trackSuccess(TrackOperations.UPDATE_CONTROL_OWNER)
          ),
          catchError((err) => {
            this.operationsTrackerService.trackError(
              TrackOperations.UPDATE_CONTROL_OWNER,
              new Error(err),
            );
            return EMPTY;
          }),
          map(() => new BatchControlsUpdatedAction([{ control_id: action.controlId, control_owner: action.owner }]))
        )
      );
    })
  );

  @Effect()
  controlOwnerUpdated$: Observable<Action> = this.actions$.pipe(
    ofType(ControlActionType.ControlOwnerUpdated),
    tap((action: ControlOwnerUpdatedAction) =>
          this.operationsTrackerService.trackSuccessWithData(TrackOperations.UPDATE_CONTROL_OWNER, action)),
    map((action: ControlOwnerUpdatedAction) => new BatchControlsUpdatedAction([{ control_id: action.controlId, control_owner: action.owner }]))
  );

  @Effect()
  batchChangeControlApplicability$: Observable<Action> = this.actions$.pipe(
    ofType(ControlActionType.BatchChangeControlApplicability),
    mergeMap((action: ControlApplicabilityBatchChangeAction) => {
      return this.controlsHttpService.changeApplicabilityState(action.control_ids, action.is_applicable).pipe(
        map(
          (response) =>
            new BatchControlsUpdatedAction(
              response.true.map((control) => ({
                control_id: control.applicability_id,
                control_is_applicable: control.is_applicable,
              }))
            )
        ),
        tap(() =>
          this.operationsTrackerService.trackSuccessWithData(TrackOperations.CHANGE_CONTROLS_APPLICABILITY, {
            controlIds: action.control_ids,
            applicability: action.is_applicable,
          })
        ),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.CHANGE_CONTROLS_APPLICABILITY, error);
          return of(
            // return a control in previous state if an error is thrown
            new BatchControlsUpdatedAction(
              action.control_ids.map((controlId) => ({
                control_id: controlId,
                control_is_applicable: action.is_applicable,
              }))
            )
          );
        })
      );
    })
  );

  @Effect()
  batchUpdate$ = this.actions$.pipe(
    ofType(ControlActionType.BatchControlsUpdate),
    mergeMap((batchAction: BatchControlsUpdateAction) => {
      return forkJoin(batchAction.batchControlsIds.map((controlId) => this.controlsHttpService.getControl(controlId)));
    }),
    map((batchResponse) => {
      return new BatchControlsUpdatedAction(batchResponse);
    })
  );

  @Effect()
  requirementRemoved$: Observable<Action> = this.actions$.pipe(
    ofType(RequirementsActionType.RequirementRemoved),
    mergeMap((action: RequirementRemovedAction) =>
      this.store
        .select((state) => state.controlsState)
        .pipe(
          take(1),
          mergeMap((state: ControlsState) => {
            const control = state.controls.entities[action.control_id];
            // remove requirement from the requested control
            const updatedControl = {
              control_id: control.control_id,
              control_requirement_ids: removeItemFromList(control.control_requirement_ids, action.requirement_id),
            } as Control;
            return of(new BatchControlsUpdatedAction([updatedControl]));
          })
        )
    )
  );

  @Effect() // customRequirement
  requirementAdded$ = this.actions$.pipe(
    ofType(RequirementsActionType.RequirementsAdded),
    switchMap((action: RequirementAddedAction) =>
      from(
        (async () => {
          const controls = await this.store
            .select((state) => state.controlsState.controls.entities)
            .pipe(
              map((controlEntities) =>
                action.requirementRelatedControlIds.map((controlId) => controlEntities[controlId])
              ),
              take(1)
            )
            .toPromise();
          const updates = controls.map(
            (control) =>
              ({
                control_id: control.control_id,
                control_requirement_ids: [...control.control_requirement_ids, action.requirement.requirement_id],
              } as Control)
          );
          return new BatchControlsUpdatedAction(updates);
        })()
      )
    )
  );

  @Effect()
  addCustomControl$: Observable<Action> = this.actions$.pipe(
    ofType(ControlActionType.AddCustomControl),
    mergeMap((action: AddCustomControlAction) =>
      this.controlsHttpService
        .addNewCustomControl(action.framework_id, action.modalData)
        .pipe(map((response) => ({ response, action })))
    ),
    mergeMap(async (accumulatedData) => {
      const user = await this.authService.getUserAsync();
      return { ...accumulatedData, user };
    }),
    tap((accumulatedData) =>
      this.operationsTrackerService.trackSuccessWithData(
        TrackOperations.ADD_CUSTOM_CONTROL,
        accumulatedData.response.control_id
      )
    ),
    map((accumulatedData) => {
      const mappedControl = this.mapAddControlResponseToControl(
        accumulatedData.action,
        accumulatedData.response,
        accumulatedData.user
      );
      return new CustomControlAddedAction(mappedControl, [accumulatedData.action.framework_id]);
    })
  );

  @Effect()
  editCustomerControl$: Observable<Action> = this.actions$.pipe(
    ofType(ControlActionType.EditCustomControl),
    mergeMap((action: EditCustomControlAction) =>
      this.controlsHttpService.updateCustomControl(action.control_id, action.modalData).pipe(
        map(() => new UpdateControlAction(action.control_id)),
        tap((updateControlAction) =>
          this.operationsTrackerService.trackSuccessWithData(
            TrackOperations.UPDATE_CUSTOM_CONTOL,
            updateControlAction.controlId
          )
        ),
        catchError((err) => {
          this.operationsTrackerService.trackError(TrackOperations.UPDATE_CUSTOM_CONTOL, err);
          return NEVER;
        })
      )
    )
  );

  @Effect() // customRequirement
  removeCustomControl$ = this.actions$.pipe(
    ofType(ControlActionType.RemoveCustomControl),
    mergeMap((action: RemoveCustomControlAction) => {
      return this.controlsHttpService.removeCustomControl(action.control_id).pipe(
        map(() => new CustomControlRemovedAction(action.control_id)),
        tap(() => {
          this.operationsTrackerService.trackSuccess(action.control_id, TrackOperations.CUSTOM_CONTROL_REMOVED);
        }),
        catchError(() => {
          this.operationsTrackerService.trackError(
            action.control_id,
            new Error(),
            TrackOperations.CUSTOM_CONTROL_REMOVED
          );
          return EMPTY;
        })
      );
    })
  );

  private mapAddControlResponseToControl(
    action: AddCustomControlAction,
    response: CustomControlFormData,
    user: { [key: string]: any }
  ): Control {
    // The last edit time format as it is returned from the API
    const last_edit_time = formatDate(new Date().getTime(), ApiDateFormat, this.locale, ApiTimeZone);
    const frameworkNameWithTsc: { [key: string]: string[] } = {
      [action.framework_name]: response.control_original_related_controls,
    };
    return {
      control_id: response.control_id,
      control_name: response.control_name,
      control_description: response.control_description,
      control_category: response.control_framework_category,
      control_status: response.control_status,
      control_note_exists: false,
      // defaults for newly created control
      control_is_applicable: true,
      control_is_custom: true,
      control_requirement_ids: [],
      control_related_frameworks: [],
      control_related_frameworks_names: frameworkNameWithTsc,
      control_edited_by: user.name?.replace(' ', ''),
      control_last_edit_time: last_edit_time,
    };
  }
}
