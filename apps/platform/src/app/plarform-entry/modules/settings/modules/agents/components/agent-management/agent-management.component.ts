import { AgentModalService } from './../../services/agent-modals/agent-modals.service';
import { AgentsFacadeService } from 'core/modules/data/services/facades/agent-facade/agents-facade.service';
import { translationRootKey } from '../../models/constants';
import { MenuAction, TabModel } from 'core/modules/dropdown-menu/types';
import { AgentItemEntity } from './../../models/agent-item-entities.models';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { agentsIconsPathFactory } from './../../utils/icons-path-factory.function';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';

const agentManagementTranslationKey = 'agentManagement';

@Component({
  selector: 'app-agent-management',
  templateUrl: './agent-management.component.html',
  styleUrls: ['./agent-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentManagementComponent implements OnInit {
  readonly agentIconPathFactory = agentsIconsPathFactory;

  threeDotsMenu: MenuAction<AgentItemEntity>[] = [];

  downloadVMButtonLoader$ = new Subject<boolean>();

  @ViewChild('info', { static: true })
  private infoTab: TemplateRef<any>;

  @ViewChild('connectedPlugins', { static: true })
  private connectedPluginsTab: TemplateRef<any>;

  @ViewChild('logs', { static: true })
  private logsTab: TemplateRef<any>;

  tabModel$ = new BehaviorSubject<TabModel[]>(null);

  @Input()
  selectedAgentViewItem: AgentItemEntity;

  @Output()
  close = new EventEmitter();

  @Output()
  agentRemoved = new EventEmitter();

  constructor(
    private agentFacade: AgentsFacadeService,
    private agentModalService: AgentModalService,
    private onPremEventService: OnPremEventService
  ) {}

  ngOnInit(): void {
    this.initTabModels();
    this.resolveThreeDotsMenu();
  }

  buildTranslationKey(key: string): string {
    return `${translationRootKey}.${agentManagementTranslationKey}.${key}`;
  }

  async downloadVM(): Promise<void> {
    this.onPremEventService.trackDownloadVMEvent();
    try {
      this.downloadVMButtonLoader$.next(true);
      window.location.href = await this.agentFacade.getAgentOVA();
    } finally {
      this.downloadVMButtonLoader$.next(false);
    }
  }

  trackTabSelection(tabId: string):void {
    this.onPremEventService.trackTabNavigationEvent(tabId);
  }

  private resolveThreeDotsMenu(): void {
    this.threeDotsMenu = [
      {
        icon: 'trash-bucket',
        translationKey: this.buildTranslationKey('removeTheAgent'),
        action: () => {
          this.agentModalService.openRemoveAgentConfirmationModals(async () => {
            await this.agentFacade.removeAgent(this.selectedAgentViewItem.agentObject.id);
            this.agentRemoved.emit();
          });
        },
      },
    ];
  }

  private initTabModels(): void {
    this.tabModel$.next([
      {
        tabTemplate: this.infoTab,
        translationKey: this.buildTranslationKey('tabs.info'),
        tabId: 'info'
      },
      {
        tabTemplate: this.connectedPluginsTab,
        translationKey: this.buildTranslationKey('tabs.connectedPlugins'),
        tabId: 'connected plugins'
      },
      {
        tabTemplate: this.logsTab,
        translationKey: this.buildTranslationKey('tabs.logs'),
        tabId: 'logs'
      },
    ]);
  }
}
