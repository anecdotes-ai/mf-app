import { AgentModalService } from './../../../../services/agent-modals/agent-modals.service';
import { AgentsFacadeService } from 'core/modules/data/services/facades/agent-facade/agents-facade.service';
import { translationRootKey } from './../../../../models/constants';
import { Agent } from 'core/modules/data/models/domain';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { AppConfigService, WindowHelperService } from 'core';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';

const agentManagementTranslationKey = 'agentManagement';

@Component({
  selector: 'app-agent-info-tab',
  templateUrl: './agent-info-tab.component.html',
  styleUrls: ['./agent-info-tab.component.scss'],
})
export class AgentInfoTabComponent {
  regenerateButtonLoader$ = new Subject<boolean>();
  readonly apiKeyFieldControl = new FormControl('');

  @Input()
  agent: Agent;

  link = this.appConfig.config.redirectUrls.howToConfigureAgent;

  constructor(
    private agentFacade: AgentsFacadeService,
    private modalService: AgentModalService,
    public appConfig: AppConfigService,
    private onPremEventService: OnPremEventService,
    private windowHelper: WindowHelperService
  ) {}

  regenerateApiClick(): void {
    this.modalService.openRegenerateApiModal(this.regenerateApiKey.bind(this));
  }

  private async regenerateApiKey(): Promise<void> {
    this.onPremEventService.trackRegenerateKeyEvent(this.agent.id);
    try {
      this.regenerateButtonLoader$.next(true);
      await this.agentFacade.rotateAgentsApiKey(this.agent.id);
    } finally {
      this.regenerateButtonLoader$.next(false);
    }
  }

  buildTranslationKey(key: string): string {
    return `${translationRootKey}.${agentManagementTranslationKey}.infoTab.${key}`;
  }

  openGuideLink(): void {
    this.onPremEventService.trackHowToGuideLinkClickEvent();
    this.windowHelper.openUrlInNewTab(this.link);
  }
}
