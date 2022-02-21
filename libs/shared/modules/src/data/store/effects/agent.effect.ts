import { TrackOperations } from '../../services';
import { OperationsTrackerService } from './../../services/operations-tracker/operations-tracker.service';
import {
  AgentsActions,
} from './../actions/agents.actions';
import { AgentService } from './../../services/agent/agent.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, EMPTY, NEVER } from 'rxjs';
import { map, mergeMap, take, tap, catchError } from 'rxjs/operators';

@Injectable()
export class AgentsEffects {
  constructor(
    private actions$: Actions,
    private agentHttpService: AgentService,
    private operationsTrackerService: OperationsTrackerService) { }

  @Effect()
  initAgents$: Observable<Action> = this.actions$.pipe(
    ofType(AgentsActions.initAgentsState),
    take(1),
    mergeMap(() => this.agentHttpService.getAgents().pipe(
      map((agents) => AgentsActions.agentsLoaded({ payload: agents }))
    ))
  );

  getOva$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AgentsActions.getAgentOva),
      mergeMap((_) => {
        return this.agentHttpService.getAgentsOva().pipe(
          tap((res) => {
            this.operationsTrackerService.trackSuccessWithData(TrackOperations.GET_AGENT_OVA, res);
          }),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.GET_AGENT_OVA, new Error(error));
            return EMPTY;
          })
        );
      })
    );
  }, { dispatch: false })

  @Effect()
  removeAgent$: Observable<Action> = this.actions$.pipe(
    ofType(AgentsActions.removeAgent),
    mergeMap((action) => {
      return this.agentHttpService.removeAgent(action.agent_id).pipe(
        tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.REMOVE_AGENT, action.agent_id)),
        map(() => AgentsActions.agentRemoved({ agent_id: action.agent_id })),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.REMOVE_AGENT, new Error(error), action.agent_id);
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  addAgent$: Observable<Action> = this.actions$.pipe(
    ofType(AgentsActions.addAgent),
    mergeMap((action) => {
      return this.agentHttpService.addAgent(action.agent_name).pipe(
        map((response) => AgentsActions.agentAdded({ agent: response })),
        tap((res) => this.operationsTrackerService.trackSuccessWithData(TrackOperations.ADD_AGENT, res.agent, action.agent_name)),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.ADD_AGENT, error, action.agent_name);
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  agentApiKeyRotate$: Observable<Action> = this.actions$.pipe(
    ofType(AgentsActions.rotateAgentApiKey),
    mergeMap((action) => {
      return this.agentHttpService.rotateAgentsApikey(action.agent_id).pipe(
        tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.ROTATE_AGENT_APIKEY)),
        map((response) => AgentsActions.agentApiKeyUpdated({ agent_id: action.agent_id, api_key: response.api_key })),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.ROTATE_AGENT_APIKEY, new Error(error));
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  loadAgentsLog$: Observable<Action> = this.actions$.pipe(
    ofType(AgentsActions.loadAgentLogs),
    mergeMap((action) => {
      return this.agentHttpService
        .getAgentsLogs(action.agent_id)
        .pipe(
          tap((_) => this.operationsTrackerService.trackSuccess(TrackOperations.GET_AGENT_LOGS, action.agent_id)),
          map((response) => AgentsActions.agentLogsLoaded({ agent_id: action.agent_id, logs: response })),
          catchError((err) => {
            this.operationsTrackerService.trackError(TrackOperations.GET_AGENT_LOGS, new Error(err), action.agent_id);
            return NEVER;
          }));
    })
  );
}
