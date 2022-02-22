import { PluginNavigationService } from 'core/services';
import { PluginService, PluginFacadeService } from 'core/modules/data/services';
import { Service, ServiceStatusEnum, Agent } from 'core/modules/data/models/domain';
import { translationRootKey } from './../../../../models/constants';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';

const agentManagementTranslationKey = 'agentManagement';

@Component({
  selector: 'app-agent-connected-plugins-tab',
  templateUrl: './agent-connected-plugins-tab.component.html',
  styleUrls: ['./agent-connected-plugins-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentConnectedPluginsTabComponent implements OnChanges {
  readonly serviceStatuses = ServiceStatusEnum;

  @Input()
  agent: Agent;

  agentRelatedServices$: Observable<Service[]>;

  serviceIconsMap: { [key: string]: Observable<string> } = {};

  constructor(
    private pluginFacade: PluginFacadeService,
    private pluginService: PluginService,
    private pluginsNavigationService: PluginNavigationService,
    private onPremEventService: OnPremEventService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('agent' in changes) {
      // Refresh icons
      this.serviceIconsMap = {};
      this.agent.tunnels.forEach((tunnel) => {
        this.serviceIconsMap[tunnel.service] = this.pluginService.getServiceIconLink(tunnel.service);
      });

      const allTunnelServices = this.agent.tunnels.map((tunnel) => {
        return this.pluginFacade.getServiceById(tunnel.service);
      });

      this.agentRelatedServices$ = combineLatest(allTunnelServices).pipe(
        map((services) => {
          return services.reduce((prev, curr) => {
            return [...prev, curr];
          }, [] as Service[]);
        })
      );
    }
  }

  redirectToEvidencePool(service: Service): void {
    this.onPremEventService.trackViewEvidenceClickEvent(service);
    this.pluginsNavigationService.redirectToEvidencePool(service);
  }

  navigateToPluginPage(service: Service): void {
    this.onPremEventService.trackPluginNameClickEvent(service);
    this.pluginsNavigationService.navigateToPluginDetails(service.service_id);
  }

  buildTranslationKey(key: string): string {
    return `${translationRootKey}.${agentManagementTranslationKey}.connectedPluginsTab.${key}`;
  }
}
