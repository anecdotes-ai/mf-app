import { Action, createAction, props } from '@ngrx/store';
import { CollectionResult } from 'core/models/collection-result.model';
import { EvidenceLike } from 'core/modules/data/models';
import { EvidenceCollectionTypeEnum } from 'core/modules/shared-controls/models/evidence-collection-modal-params';
import { ControlRequirement, EvidenceInstance, EvidenceRunHistoryEntity, EvidenceStatusEnum, Policy } from '../../models/domain';

export const EvidenceActionType = {
  InitEvidencePoolState: '[Evidence Pool] Init Evidence Pool State',
  EvidencesLoaded: '[Evidences] Evidences loaded',

  LoadEvidenceHistoryRun: '[Evidences/History Run] Load evidence history run',
  EvidenceHistoryRunLoaded: '[Evidences/History Run] Evidence history run loaded',

  EvidenceApplicabilityChange: '[Evidences] Evidence applicability state change',

  RemoveLink: '[Evidence] Remove link',
  EvidenceLinkRemoved: '[Evidence] Removed evidence link',

  BatchUpdateEvidence: '[Evidences] Update Evidences',
  EvidenceUpdated: '[Evidence] Updated',
  EvidenceBatchUpdated: '[Evidences] Batch Updated',
  EvidenceUploaded: '[Evidences] evidence uploaded',

  HandleCollection: '[Evidences] Handle Evidence Collection',

  SetEvidenceStatus: '[Evidences] Set Evidence Status',

  AddEvidenceToResource: '[Evidence] Add evidence to Resource',
  AddEvidence: '[Evidence] Add evidence',
  EvidenceAddedToResource: '[Evidence] Evidence was added to Resource',

  RemovedEvidenceFromResource: '[Evidence] Remove evidence from Resource',
  EvidenceRemovedFromResource: '[Evidence] Evidence was removed from Resource',

  UpdateEvidenceOfResource: '[Evidence] Update evidence of Resource',
  EvidenceOfResourceUpdated: '[Evidence] Evidence of Resource was updated',

  CreateEvidenceURL: '[Evidence] Add Evidence URL',
  AddEvidenceSharedLink: '[Evidence] Add Evidence shared link',
  AddEvidenceFromTicket: '[Evidence] Add Evidence from ticket',
  AddEvidenceFromDevice: '[Evidence] Add Evidence from device',
};

// ** EVIDENCE LOADING **
export class EvidencesLoadedAction implements Action {
  readonly type = EvidenceActionType.EvidencesLoaded;

  constructor(public evidences: EvidenceInstance[]) { }
}

export class EvidenceApplicabilityChangeAction implements Action {
  readonly type = EvidenceActionType.EvidenceApplicabilityChange;

  constructor(public evidence: EvidenceInstance) { }
}

// ** EVIDENCE STORE UPDATES **
export class BatchUpdateEvidence implements Action {
  readonly type = EvidenceActionType.BatchUpdateEvidence;

  constructor(public evidenceIds: string[]) { }
}

export class EvidenceUpdatedAction implements Action {
  readonly type = EvidenceActionType.EvidenceUpdated;

  constructor(public evidence: EvidenceInstance) { }
}

export class EvidenceBatchUpdatedAction implements Action {
  readonly type = EvidenceActionType.EvidenceBatchUpdated;

  constructor(public updatedBatch: EvidenceInstance[]) { }
}

// ** EVIDENCE STATUS UPDATE **
export class SetEvidenceStatusAction implements Action {
  readonly type = EvidenceActionType.SetEvidenceStatus;

  constructor(public payload: SetEvidenceStatusPayload) { }
}

// ** EVIDENCE REMOVE LINK (betweem requierment and evidence) **
export class RemoveLinkAction implements Action {
  readonly type = EvidenceActionType.RemoveLink;

  constructor(public payload: RemoveLinkPayload) { }
}

export class EvidenceLinkRemovedAction implements Action {
  readonly type = EvidenceActionType.EvidenceLinkRemoved;

  constructor(public payload: RemoveLinkPayload) { }
}
// ** Add evidence to Resource **
export class AddEvidenceToResourceAction implements Action {
  readonly type = EvidenceActionType.AddEvidenceToResource;

  constructor(public payload: AddEvidencePayload) { }
}

export class EvidenceAddedToResourceAction implements Action {
  readonly type = EvidenceActionType.EvidenceAddedToResource;

  constructor(public payload: any) { }
}

// ** Remove evidence to Resource **
export class RemoveEvidenceFromResourceAction implements Action {
  readonly type = EvidenceActionType.RemovedEvidenceFromResource;

  constructor(public payload: RemoveEvidencePayload) { }
}

export class EvidenceRemovedFromResourceAction implements Action {
  readonly type = EvidenceActionType.EvidenceRemovedFromResource;

  constructor(public resource: ControlRequirement | Policy, public evidenceId: string) { }
}
// ** Update evidence to Resource **
export class UpdateEvidenceOfResourceAction implements Action {
  readonly type = EvidenceActionType.UpdateEvidenceOfResource;

  constructor(public payload: AddEvidencePayload) { }
}

export class EvidenceOfResourceUpdatedAction implements Action {
  readonly type = EvidenceActionType.EvidenceOfResourceUpdated;

  constructor(public payload: any) { }
}

export class CreateEvidenceURLAction implements Action {
  readonly type = EvidenceActionType.CreateEvidenceURL;
  constructor(public requirement_id: string, public url: string, public evidence_name: string) { }
}

export class AddEvidenceSharedLinkAction implements Action {
  readonly type = EvidenceActionType.AddEvidenceSharedLink;
  constructor(
    public resourceType: string,
    public resource_id: string,
    public service_id: string,
    public service_instance_id: string,
    public evidence?: File,
    public link?: string,
    public controlId?: string,
    public frameworkId?: string,
  ) { }
}

export class AddEvidenceFromTicketAction implements Action {
  readonly type = EvidenceActionType.AddEvidenceFromTicket;
  constructor(public requirement_id: string, public service_id: string, public service_instance_id: string, public tickets: string[]) { }
}

export class AddEvidenceFromDeviceAction implements Action {
  readonly type = EvidenceActionType.AddEvidenceFromDevice;
  constructor(public payload: AddEvidencePayload) { }
}

// ** Evidence Collection **
export class EvidenceCollectionAction implements Action {
  readonly type = EvidenceActionType.HandleCollection;

  constructor(public collectionResult: CollectionResult) { }
}

// ** ADAPTER ACTIONS - used in the reducer **

export const EvidenceAdapterActions = {
  loadEvidenceHistoryRun: createAction(EvidenceActionType.LoadEvidenceHistoryRun, props<{ evidence_id: string, lastDate: number }>()),
  evidenceHistoryRunLoaded: createAction(EvidenceActionType.EvidenceHistoryRunLoaded, props<{ evidence_id: string, historyObj: EvidenceRunHistoryEntity }>()),
  evidenceLoaded: createAction(EvidenceActionType.EvidencesLoaded, props<{ evidences: EvidenceInstance[] }>()),
  evidenceLinkRemoved: createAction(EvidenceActionType.EvidenceLinkRemoved, props<{ payload: RemoveLinkPayload }>()),
  evidenceUpdated: createAction(EvidenceActionType.EvidenceUpdated, props<{ evidence: EvidenceInstance }>()),
  evidencesUploaded: createAction(
    EvidenceActionType.EvidenceUploaded,
    props<{
      evidences: EvidenceLike[],
      evidenceType?: EvidenceCollectionTypeEnum,
      frameworkId?: string,
      controlId?: string,
      targetResourceParams?: { resourceId: string, resourceType: string }
    }>()),
  evidenceBatchUpdated: createAction(
    EvidenceActionType.EvidenceBatchUpdated,
    props<{ updatedBatch: EvidenceInstance[] }>()
  ),
};

// ** PAYLOADS **
export interface SetEvidenceStatusPayload {
  newEvidenceStatus: EvidenceStatusEnum;
  evidence: EvidenceInstance;
}

export interface RemoveLinkPayload {
  controlId: string;
  requirementId: string;
  evidenceId: string;
}

export interface AddEvidencePayload {
  resourceType: string;
  resource_id: string;
  service_id: string;
  service_instance_id?: string;
  evidence_id?: string;
  evidence?: File;
  link?: string;
  evidenceType?: EvidenceCollectionTypeEnum;
  frameworkId?: string;
  controlId?: string;
}

export interface RemoveEvidencePayload {
  resourceId: string;
  resourceType: string;
  resource: ControlRequirement | Policy;
  evidenceId: string;
}
