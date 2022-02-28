import { TrackOperations } from '../../operations-tracker/constants/track.operations.list.constant';
import { ActionDispatcherService } from './../../action-dispatcher/action-dispatcher.service';
import {
  AgentsActions
} from './../../../store/actions/agents.actions';
import { AgentLog, Agent } from './../../../models/domain';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap, filter, switchMap } from 'rxjs/operators';
import {AgentSelectors} from '../../../store/selectors';

@Injectable()
export class AgentsFacadeService {
  constructor(private store: Store, private actionDispatcher: ActionDispatcherService) {
    this.setAllAgentsCache();
  }

  private allAgentsCache$: Observable<Agent[]>;

  getAgents(): Observable<Agent[]> {
    return this.allAgentsCache$;
  }

  getAgentsLog(agent_id: string): Observable<AgentLog[]> {
    this.actionDispatcher.dispatchActionAsync(AgentsActions.loadAgentLogs({ agent_id }), TrackOperations.GET_AGENT_LOGS, agent_id);
    return this.store
      .select(AgentSelectors.SelectAgentState)
      .pipe(map((agentState) => {
        return agentState.entities[agent_id].agentLogs;
      }));
  }

  getAgentOVA(): Promise<any> {
    return this.actionDispatcher.dispatchActionAsync(AgentsActions.getAgentOva(), TrackOperations.GET_AGENT_OVA);
  }

  removeAgent(agentId: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(AgentsActions.removeAgent({ agent_id: agentId }), TrackOperations.REMOVE_AGENT, agentId);
  }

  addAgent(agentName: string): Promise<Agent> {
    return this.actionDispatcher.dispatchActionAsync(AgentsActions.addAgent({ agent_name: agentName }), TrackOperations.ADD_AGENT, agentName);
  }

  rotateAgentsApiKey(agentId: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(AgentsActions.rotateAgentApiKey({ agent_id: agentId }), TrackOperations.ROTATE_AGENT_APIKEY);
  }

  private setAllAgentsCache(): void {
    this.allAgentsCache$ = this.store
      .select(AgentSelectors.SelectAgentState)
      .pipe(
        map((agentState) => agentState.initialized),
        tap((areInitialized) => {
          if (!areInitialized) {
            this.store.dispatch(AgentsActions.initAgentsState());
          }
        }),
        filter((initialized) => initialized),
        switchMap(() => this.store.select(AgentSelectors.SelectAgentState).pipe(map((agentState) => agentState.entities))),
        map((entity) => Object.values(entity).map((storeEntity) => storeEntity.agent)),
      );
  }
}
