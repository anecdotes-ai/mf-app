import { AgentModalService } from './../../services/agent-modals/agent-modals.service';
import { agentsIconsPathFactory } from './../../utils/icons-path-factory.function';
import { translationRootKey } from '../../models/constants';
import { AgentsFacadeService } from 'core/modules/data/services/facades/agent-facade/agents-facade.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AppConfigService, WindowHelperService } from 'core/services';
import { map, startWith, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SubscriptionDetacher } from 'core/utils';
import { AgentItemEntity, AgentItemStateEnum } from '../../models';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { OperationError } from 'core/modules/data/services';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';

@Component({
  selector: 'app-agents-layout',
  templateUrl: './agents-layout.component.html',
  styleUrls: ['./agents-layout.component.scss'],
})
export class AgentsLayoutComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private creating: boolean;
  private agents$: Observable<AgentItemEntity[]>;

  readonly saveButtonLoading$ = new Subject<boolean>();

  readonly agentIconPathFactory = agentsIconsPathFactory;

  readonly rootTranskationKey = translationRootKey;

  readonly agentItemStates = AgentItemStateEnum;

  @ViewChild('parentScroll')
  perfectScroll: PerfectScrollbarComponent;

  isAnyAgentsExist$: Observable<boolean>;
  agentItems$: Observable<AgentItemEntity[]>;
  agentItemAdded$ = new Subject<AgentItemEntity>();

  loading$ = new BehaviorSubject<boolean>(undefined);

  selectedAgentViewItem: AgentItemEntity;

  guideLink: string;

  constructor(
    private agetsFacadeService: AgentsFacadeService,
    public appConfig: AppConfigService,
    private cd: ChangeDetectorRef,
    private agentModalService: AgentModalService,
    private windowHelper: WindowHelperService,
    private onPremEventService: OnPremEventService
  ) {}

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  async selectItem(item: AgentItemEntity): Promise<void> {
    const agents = await this.agents$.pipe(take(1)).toPromise();
    this.selectedAgentViewItem = agents.find(
      (a) => a.agentObject.id === item?.agentObject?.id || a.agentObject.name === item?.agentObject?.name
    );
    this.cd.detectChanges();
  }

  async saveAgent(agentName: string): Promise<void> {
    this.onPremEventService.trackAddConnectorEvent();
    try {
      this.saveButtonLoading$.next(true);
      const createdAgent = await this.agetsFacadeService.addAgent(agentName);
      this.selectedAgentViewItem = { itemState: AgentItemStateEnum.EXISTING, agentObject: createdAgent };
    } catch (error) {
      this.agentModalService.openAgentFailedToCreate((error as OperationError).errorCode);
    } finally {
      this.saveButtonLoading$.next(false);
      this.creating = false;
    }
    this.cd.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    this.guideLink = this.appConfig.config.redirectUrls.howToConfigureAgent;
    this.loading$.next(true);

    this.isAnyAgentsExist$ = this.agetsFacadeService.getAgents().pipe(
      this.detacher.takeUntilDetach(),
      map((agents) => !!agents?.length)
    );
    this.agents$ = this.agetsFacadeService.getAgents().pipe(
      this.detacher.takeUntilDetach(),
      map((agents) => {
        const agentItemObj: AgentItemEntity[] = [];

        agents.forEach((agent) => {
          agentItemObj.push({
            agentObject: agent,
            itemState: AgentItemStateEnum.EXISTING,
          });
        });

        return agentItemObj;
      })
    );
    this.agents$.pipe(this.detacher.takeUntilDetach()).subscribe((_) => {
      this.loading$.next(false);
    });
    this.agentItems$ = this.agents$.pipe(
      switchMap((allItems) => {
        return this.agentItemAdded$.pipe(
          map((addedItem) => (this.creating ? [...allItems, addedItem] : allItems)),
          startWith(allItems)
        );
      })
    );

    await this.selectFirstItem();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${translationRootKey}.${relativeKey}`;
  }

  selectAgentId(item: AgentItemEntity): string {
    return item.itemState === AgentItemStateEnum.EXISTING ? item?.agentObject?.id : 'creating';
  }

  addNewAgentItem(): void {
    this.creating = true;
    this.agentItemAdded$.next({
      itemState: AgentItemStateEnum.CREATE_NEW,
    });
  }

  openGuideInNewTab(): void {
    this.onPremEventService.trackHowToGuideLinkClickEvent();
    this.windowHelper.openUrlInNewTab(this.guideLink);
  }

  async selectFirstItem(): Promise<void> {
    if (await this.isAnyAgentsExist$.pipe(take(1)).toPromise()) {
      const agents = await this.agents$.pipe(take(1)).toPromise();
      this.selectedAgentViewItem = agents[0];
    } else {
      this.selectedAgentViewItem = null;
    }
    this.cd.detectChanges();
  }
}
