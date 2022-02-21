import { translationRootKey } from '../../../../models/constants';
import { AgentsFacadeService } from 'core/modules/data/services/facades/agent-facade/agents-facade.service';
import { AgentLog, AgentSeverityEnum, Agent } from 'core/modules/data/models/domain';
import { Component, Input, SimpleChanges, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const agentManagementTranslationKey = 'agentManagement';

export interface AgentLogExtended extends AgentLog {
  visible?: boolean;
}

@Component({
  selector: 'app-agent-logs-tab',
  templateUrl: './agent-logs-tab.component.html',
  styleUrls: ['./agent-logs-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentLogsTabComponent implements OnChanges {
  @Input()
  agent: Agent;

  logs$: Observable<AgentLogExtended[]>;

  agentLogServerity = AgentSeverityEnum;

  constructor(private agentFacade: AgentsFacadeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('agent' in changes) {
      this.logs$ = this.agentFacade.getAgentsLog(this.agent.id).pipe(map((res) => res?.filter((log) => !!log)));
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `${translationRootKey}.${agentManagementTranslationKey}.logs.${relativeKey}`;
  }
}
