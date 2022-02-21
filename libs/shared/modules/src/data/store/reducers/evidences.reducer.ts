import { EvidenceInstance, EvidenceRunHistoryEntity } from '../../models/domain';
import { createEntityAdapter, Dictionary, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import {
  EvidenceAdapterActions,
  EvidenceBatchUpdatedAction,
  EvidenceLinkRemovedAction,
  EvidencesLoadedAction,
  EvidenceUpdatedAction,
} from '../actions/evidences.actions';
import { selectEvidenceId } from '../../utils';

let adaptersDictionary = createEntityAdapter<EvidenceInstance>({ selectId: selectEvidenceId });

export interface EvidenceState {
  evidences: EntityState<EvidenceInstance>;
  evidence_history_run: Dictionary<EvidenceRunHistoryEntity>,
  areLoaded: boolean;
}

const initialState: EvidenceState = {
  evidences: adaptersDictionary.getInitialState(),
  evidence_history_run: {},
  areLoaded: false,
};

const adapterReducer = createReducer(
  initialState,
  on(EvidenceAdapterActions.evidenceLoaded, (state: EvidenceState, action: EvidencesLoadedAction) => {
    return {
      ...state,
      areLoaded: true,
      evidences: getAdapter(state.evidences, (adapter, s) => adapter.upsertMany(action.evidences, s)),
    };
  }),
  on(EvidenceAdapterActions.evidenceLinkRemoved, (state: EvidenceState, action: EvidenceLinkRemovedAction) => {
    return {
      ...state,
      evidences: getAdapter(state.evidences, (adapter, s) => adapter.removeOne(action.payload.evidenceId, s)),
    };
  }),
  on(EvidenceAdapterActions.evidenceUpdated, (state: EvidenceState, action: EvidenceUpdatedAction) => {
    return {
      ...state,
      evidences: getAdapter(state.evidences, (adapter, s) =>
        adapter.updateOne({ id: selectEvidenceId(action.evidence), changes: action.evidence }, s)
      ),
    };
  }),
  on(EvidenceAdapterActions.evidenceBatchUpdated, (state: EvidenceState, action: EvidenceBatchUpdatedAction) => {
    return {
      ...state,
      evidences: adaptersDictionary.upsertMany(action.updatedBatch, state.evidences),
    };
  }),
  on(EvidenceAdapterActions.evidenceHistoryRunLoaded, (state: EvidenceState, action) => {
    const updatedEvidenceHistoryRun = { ...state.evidence_history_run };
    updatedEvidenceHistoryRun[action.evidence_id] = action.historyObj;
    return {
      ...state,
      evidence_history_run: updatedEvidenceHistoryRun
    };
  })
);

export function evidencesReducer(state = initialState, action: Action): EvidenceState {
  return adapterReducer(state, action);
}

function getAdapter(
  evidence: EntityState<EvidenceInstance>,
  adapterAction: (
    adapter: EntityAdapter<EvidenceInstance>,
    state: EntityState<EvidenceInstance>
  ) => EntityState<EvidenceInstance>
): EntityState<EvidenceInstance> {

  return { ...evidence, ...adapterAction(adaptersDictionary, evidence) };
}
