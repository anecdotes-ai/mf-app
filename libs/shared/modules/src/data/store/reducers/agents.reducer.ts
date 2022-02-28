import { createSortCallback, sortCallback } from 'core/utils';
import { AgentsActions } from './../actions/agents.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Agent, AgentLog } from './../../models/domain';

// export const featureKey = 'agents';
export interface AgentStoreEntity {
  agent: Agent;
  agentLogs?: AgentLog[];
}

export interface AgentsState extends EntityState<AgentStoreEntity> {
  initialized: boolean;
}

function selectAgentId(c: AgentStoreEntity): string {
  return c.agent.id;
}

export const agentsAdapter: EntityAdapter<AgentStoreEntity> = createEntityAdapter<AgentStoreEntity>({
  selectId: selectAgentId,
});

const initialState: AgentsState = agentsAdapter.getInitialState({ initialized: false });

// export const agentStateFeatureSelector = createFeatureSelector<AgentsState>(featureKey);
// export const agentStateSelector = createSelector(agentStateFeatureSelector, (state: AgentsState) => state[featureKey]);

export function agentsReducer(state = initialState, action: Action): AgentsState {
  return adapterReducer(state, action);
}

const adapterReducer = createReducer(
  initialState,
  on(AgentsActions.agentsLoaded, (state: AgentsState, action) => {
    return agentsAdapter.upsertMany(action.payload.length ? action.payload.map((agent) => ({ agent })) : [], {
      ...state,
      initialized: true,
    });
  }),
  on(AgentsActions.agentAdded, (state: AgentsState, action) => {
    return agentsAdapter.addOne({ agent: action.agent }, state);
  }),
  on(AgentsActions.agentApiKeyUpdated, (state: AgentsState, action) => {
    if (state.entities[action.agent_id]) {
      const agentStateEntity = state.entities[action.agent_id];
      const updatedAgentsStateEntity: AgentStoreEntity = {
        ...agentStateEntity,
        agent: { ...agentStateEntity.agent, api_key: action.api_key },
      };
      return agentsAdapter.updateOne({ id: action.agent_id, changes: updatedAgentsStateEntity }, state);
    }
    return state;

  }),
  on(AgentsActions.agentRemoved, (state: AgentsState, action) => {
    return agentsAdapter.removeOne(action.agent_id, state);
  }),
  on(AgentsActions.agentLogsLoaded, (state: AgentsState, action) => {
    const currLogs = state.entities[action.agent_id].agentLogs;
    const currLogsWithNew = currLogs ? [...currLogs, ...action.logs] : action.logs;

    const sortedLogs = currLogsWithNew.sort((a, b) => {
      return new Date(b.timestamp).getTime() -  new Date(a.timestamp).getTime();
    });
    return agentsAdapter.updateOne({ id: action.agent_id, changes: { agentLogs: sortedLogs } }, state);
  })
);
