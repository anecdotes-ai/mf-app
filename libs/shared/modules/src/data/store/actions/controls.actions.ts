import { CustomControlFormData } from './../../services/controls/models/add-customer-control.model';
import { Action, createAction, props } from '@ngrx/store';
import { Control, ControlStatus } from '../../models/domain';

export const ControlActionType = {
  ControlsLoaded: '[Controls] Controls loaded',

  AddCustomControl: '[Add Control] Add custom control',
  CustomControlAdded: '[Add Control] Custom control added',

  EditCustomControl: '[Edit Control] Edit custom control',
  UpdateControlStatus: '[Update Control Status] Update custom control',
  UpdateControlOwner: '[Update Control Owner] Update custom control',
  ControlOwnerUpdated: '[Control Owner Updated] control owner updated',

  LoadControlsByFramework: '[Controls] Load controls by framework',
  ControlsByFrameworkLoaded: '[Controls] Controls by framework loaded',

  ReloadControls: '[Controls] Reload controls operation in progress',
  ControlsReloaded: '[Controls] Controls reloaded',

  ControlApplicabilityChanged: '[Control] Control applicability has changed',
  BatchChangeControlApplicability: '[Control] Controls applicability batch change',

  UpdateControl: '[Control] Update control',
  BatchControlsUpdate: '[Controls] Batch controls update',
  BatchControlsUpdated: '[Controls] Controls Updated',

  RemoveCustomControl: '[Controls] Remove custom control',
  CustomControlRemoved: '[Controls] Custom control removed',
};

export class ControlsLoadedAction implements Action {
  readonly type = ControlActionType.ControlsLoaded;

  constructor(public payload: Control[]) {}
}

// ** LOADING OF CONTROLS OF SPECIFIC FRAMEWORK **
export class LoadControlsByFrameworkAction implements Action {
  readonly type = ControlActionType.LoadControlsByFramework;

  constructor(public framework_id: string) {}
}

export class ControlsByFrameworkLoadedAction implements Action {
  readonly type = ControlActionType.ControlsByFrameworkLoaded;

  constructor(public framework_id: string, public controls: Control[]) {}
}

// ** CUSTOMIZE CONTROL **
export class AddCustomControlAction implements Action {
  readonly type = ControlActionType.AddCustomControl;

  constructor(public framework_id: string, public modalData: CustomControlFormData, public framework_name?: string) {}
}

export class CustomControlAddedAction implements Action {
  readonly type = ControlActionType.CustomControlAdded;

  constructor(public control: Control, public relatedFrameworkIds: string[]) {}
}

export class EditCustomControlAction implements Action {
  readonly type = ControlActionType.EditCustomControl;

  constructor(public control_id: string, public modalData: CustomControlFormData) {}
}

// ** ALL CONTROLS REFRESH **
export class ReloadControlsAction implements Action {
  readonly type = ControlActionType.ReloadControls;

  constructor() {}
}

export class ControlsReloadedAction implements Action {
  readonly type = ControlActionType.ControlsReloaded;

  constructor(public payload: Control[]) {}
}

// ** APPLICABILITY **
export class ControlApplicabilityChangedAction implements Action {
  readonly type = ControlActionType.ControlApplicabilityChanged;

  constructor(public control_id: string, public is_applicable: boolean) {}
}

export class ControlApplicabilityBatchChangeAction implements Action {
  readonly type = ControlActionType.BatchChangeControlApplicability;

  constructor(public control_ids: string[], public is_applicable: boolean) {}
}

// ** CONTROLS UPDATES **

export class UpdateControlAction implements Action {
  readonly type = ControlActionType.UpdateControl;

  constructor(public controlId: string) {}
}

export class UpdateControlStatusAction implements Action {
  readonly type = ControlActionType.UpdateControlStatus;

  constructor(public controlId: string, public payload: ControlStatus) {}
}

export class UpdateControlOwnerAction implements Action {
  readonly type = ControlActionType.UpdateControlOwner;

  constructor(public controlId: string, public owner: string) {}
}

export class ControlOwnerUpdatedAction implements Action {
  readonly type = ControlActionType.ControlOwnerUpdated;

  constructor(public controlId: string, public owner: string) {}
}

export class BatchControlsUpdateAction implements Action {
  readonly type = ControlActionType.BatchControlsUpdate;

  constructor(public batchControlsIds: string[]) {}
}

export class BatchControlsUpdatedAction implements Action {
  readonly type = ControlActionType.BatchControlsUpdated;

  constructor(public batch: Control[]) {}
}

// ** CUSTOM CONTROL REMOVAL **

export class RemoveCustomControlAction implements Action {
  readonly type = ControlActionType.RemoveCustomControl;

  constructor(public control_id: string) {}
}

export class CustomControlRemovedAction implements Action {
  readonly type = ControlActionType.CustomControlRemoved;

  constructor(public control_id: string) {}
}

// ** ADAPTER ACTIONS - used in the reducer **

export const ControlAdapterActions = {
  controlsLoaded: createAction(
    ControlActionType.ControlsLoaded,
    props<{ payload: { [framework_id: string]: Control[] } }>()
  ),
  controlsReloaded: createAction(
    ControlActionType.ControlsReloaded,
    props<{ payload: { [framework_id: string]: Control[] } }>()
  ),
  changeApplicability: createAction(
    ControlActionType.BatchChangeControlApplicability,
    props<{ control_ids: string[]; is_applicable: boolean }>()
  ),
  applicabilityChanged: createAction(
    ControlActionType.ControlApplicabilityChanged,
    props<{ control_id: string; is_applicable: boolean }>()
  ),
  controlsByFrameworkLoaded: createAction(
    ControlActionType.ControlsByFrameworkLoaded,
    props<{ framework_id: string; controls: Control[] }>()
  ),
  batchControlsUpdated: createAction(ControlActionType.BatchControlsUpdated, props<{ batch: Control[] }>()),
  customControlRemoved: createAction(ControlActionType.CustomControlRemoved, props<{ control_id: string }>()),
  customControlAdded: createAction(
    ControlActionType.CustomControlAdded,
    props<{ control: Control; relatedFrameworkIds: string[] }>()
  ),
  updateControlStatus: createAction(ControlActionType.UpdateControlStatus, props<{ controlId: string, newStatus: ControlStatus, oldStatus: ControlStatus }>()),
};
