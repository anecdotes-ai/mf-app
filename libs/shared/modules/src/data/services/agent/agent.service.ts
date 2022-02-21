import { AppConfigService } from 'core/services/config/app.config.service';
import { AbstractService } from '../abstract-http/abstract-service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Agent, AgentLog } from '../../models/domain';

@Injectable({
  providedIn: 'root',
})
export class AgentService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  }

  getAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.buildUrl((t) => t.getAgents));
  }

  removeAgent(agentId: string): Observable<any> {
    return this.http.delete(this.buildUrl((t) => t.removeAgent, { agent_id: agentId }));
  }

  addAgent(agentName: string): Observable<Agent> {
    return this.http.post<Agent>(this.buildUrl((t) => t.addAgent), { agent_name: agentName });
  }

  getAgentsOva(): Observable<string> {
    return this.http.get<string>(this.buildUrl((t) => t.getAgentsOVA), { responseType: 'text' as any });
  }

  rotateAgentsApikey(agentId: string): Observable<{ api_key: string }> {
    return this.http.post<{ api_key: string }>(this.buildUrl((t) => t.rotateAgentsApiKey, { agent_id: agentId }), null);
  }

  getAgentsLogs(agentId: string): Observable<AgentLog[]> {
    return this.http.get<AgentLog[]>(this.buildUrl((t) => t.getAgentsLogs, { agent_id: agentId }));
  }

}
