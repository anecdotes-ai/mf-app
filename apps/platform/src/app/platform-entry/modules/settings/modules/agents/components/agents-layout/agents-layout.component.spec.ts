import { AgentModalService } from './../../services/agent-modals/agent-modals.service';
import { AgentsFacadeService } from 'core/modules/data/services/facades/agent-facade/agents-facade.service';
import { AppConfigService } from 'core/services/config/app.config.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentsLayoutComponent } from './agents-layout.component';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { environment } from '../../../../../../../environments/environment.develop';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';
import { TranslateModule } from '@ngx-translate/core';
import { Agent, AgentGeneralStatuses } from 'core/modules/data/models/domain';
import { of } from 'rxjs';
import { AgentItemEntity, AgentItemStateEnum } from '../../models';

describe('AgentsLayoutComponent', () => {
  let component: AgentsLayoutComponent;
  let fixture: ComponentFixture<AgentsLayoutComponent>;
  let appConfigService;
  let onPremEventService: OnPremEventService;
  let windowHelperService: WindowHelperService;
  let agentModalService: AgentModalService;
  let agentFacade: AgentsFacadeService;

  const agent: AgentItemEntity = {
    itemState: AgentItemStateEnum.EXISTING,
    agentObject: {
      id: 'id',
      status: {},
      name: 'name',
      tunnels: [],
      api_key: 'key'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentsLayoutComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AgentModalService, useValue: {} },
        { provide: AgentsFacadeService, useValue: {} },
        { provide: AppConfigService, useValue: {} },
        { provide: WindowHelperService, useValue: {} },
        { provide: OnPremEventService, useValue: {} },
        { provide: AgentsFacadeService, useValue: {} },

      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentsLayoutComponent);
    component = fixture.componentInstance;

    appConfigService = TestBed.inject(AppConfigService);
    (appConfigService as any).config = environment.config;

    onPremEventService = TestBed.inject(OnPremEventService);
    onPremEventService.trackHowToGuideLinkClickEvent = jasmine.createSpy('trackHowToGuideLinkClick');
    onPremEventService.trackAddConnectorEvent = jasmine.createSpy('trackAddConnectorEvent');
    onPremEventService.trackConnectorStatusChangingEvent = jasmine.createSpy('trackConnectorStatusChangingEvent');

    windowHelperService = TestBed.inject(WindowHelperService);
    windowHelperService.openUrlInNewTab = jasmine.createSpy('openUrlInNewTab');

    agentModalService = TestBed.inject(AgentModalService);
    agentModalService.openAgentFailedToCreate = jasmine.createSpy('openAgentFailedToCreate');

    agentFacade = TestBed.inject(AgentsFacadeService);
    agentFacade.addAgent = jasmine.createSpy('addAgent').and.returnValue(
      Promise.resolve({
        id: 'some-id',
        status: {
          general_status: AgentGeneralStatuses.NEVER_DEPLOYED,
        },
      } as Agent)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onPremEventService.trackHowToGuideLinkClickEvent when component.openGuideInNewTab is called', () => {
    // Arrange
    // Act
    component.openGuideInNewTab();

    // Assert
    expect(onPremEventService.trackHowToGuideLinkClickEvent).toHaveBeenCalledWith();
  });

  it('should call onPremEventService.trackAddConnectorEvent when component.saveAgent is called', async () => {
    // Arrange
    // Act
    await component.saveAgent('some-agent');

    // Assert
    expect(onPremEventService.trackAddConnectorEvent).toHaveBeenCalledWith();
  });

  it('should select first agent if agents array is not empty', async () => {
    // Arrange
    agentFacade.getAgents = jasmine.createSpy('getAgents').and.returnValue(of([agent.agentObject]));

    // Act
    fixture.detectChanges();
    await component.selectFirstItem();

    // Assert
    expect(component.selectedAgentViewItem).toEqual(agent);
  });

  it('selected agent should be equal to null if agents array is empty', async () => {
    // Arrange
    agentFacade.getAgents = jasmine.createSpy('getAgents').and.returnValue(of([]));

    // Act
    fixture.detectChanges();
    await component.selectFirstItem();

    // Assert
    expect(component.selectedAgentViewItem).toEqual(null);
  });
});
