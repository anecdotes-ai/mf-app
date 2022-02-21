import { Agent, AgentLog } from './../../models/domain';
import { createAction, props } from '@ngrx/store';

export const AgentActionType = {
  InitAgentsState: '[Agents] Init state',
  GetAgentOVA: '[Agent] Get Ova',

  LoadAgents: '[Agents] Load agents',
  AgentsLoaded: '[Agents] Agents loaded',

  AddAgent: '[Add Agent] Add agent',
  AgentAdded: '[Add Agent] Agent added',

  RemoveAgent: '[Agent] Remove agent',
  AgentRemoved: '[Agent] Agents removed',

  RotateAgentApiKey: '[Rotate Agent ApiKey] Edit Agent ApiKey',
  AgentApikeyUpdated: '[Agent ApiKey] Agent ApiKey was updated',

  LoadLogs: '[Agent Logs] Load agent logs',
  LogsLoaded: '[Agent Logs] Agent logs Loaded',
};

export const AgentsActions = {
  initAgentsState: createAction(AgentActionType.InitAgentsState),
  getAgentOva: createAction(AgentActionType.GetAgentOVA),

  loadAgents: createAction(AgentActionType.LoadAgents),
  agentsLoaded: createAction(AgentActionType.AgentsLoaded, props<{ payload: Agent[] }>()),

  addAgent: createAction(AgentActionType.AddAgent, props<{ agent_name: string }>()),
  agentAdded: createAction(
    AgentActionType.AgentAdded,
    props<{
      agent: Agent;
    }>()
  ),
  rotateAgentApiKey: createAction(AgentActionType.RotateAgentApiKey, props<{ agent_id: string }>()),
  agentApiKeyUpdated: createAction(
    AgentActionType.AgentApikeyUpdated,
    props<{
      agent_id: string;
      api_key: string
    }>()
  ),

  removeAgent: createAction(AgentActionType.RemoveAgent, props<{ agent_id: string }>()),
  agentRemoved: createAction(
    AgentActionType.AgentRemoved,
    props<{
      agent_id: string;
    }>()
  ),
  loadAgentLogs: createAction(AgentActionType.LoadLogs, props<{ agent_id: string }>()),
  agentLogsLoaded: createAction(
    AgentActionType.LogsLoaded,
    props<{
      agent_id: string;
      logs: AgentLog[];
    }>()
  ),
};
