import { AgentModalService } from './../../../../services/agent-modals/agent-modals.service';
import { AgentsFacadeService } from 'core/modules/data/services/facades/agent-facade/agents-facade.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentInfoTabComponent } from './agent-info-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';
import { WindowHelperService } from 'core';

describe('AgentInfoTabComponent', () => {
  let component: AgentInfoTabComponent;
  let fixture: ComponentFixture<AgentInfoTabComponent>;
  let windowHelper: WindowHelperService;
  let onPremEventService: OnPremEventService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentInfoTabComponent],
      providers: [
        { provide: AgentsFacadeService, useValue: {} },
        { provide: AgentModalService, useValue: {} },
        { provide: OnPremEventService, useValue: {} },
        { provide: WindowHelperService, useValue: {} },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentInfoTabComponent);
    component = fixture.componentInstance;

    windowHelper = TestBed.inject(WindowHelperService);
    windowHelper.openUrlInNewTab = jasmine.createSpy('openUrlInNewTab');

    onPremEventService = TestBed.inject(OnPremEventService);
    onPremEventService.trackHowToGuideLinkClickEvent = jasmine.createSpy('trackHowToGuideLinkClickEvent');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onPremEventService.trackHowToGuideLinkClickEvent and windowHelper.openUrlInNewTab when component.openGuideLink is called', () => {
    // Arrange
    component.link = 'some-link';

    // Act
    component.openGuideLink();

    // Assert
    expect(onPremEventService.trackHowToGuideLinkClickEvent).toHaveBeenCalledWith();
    expect(windowHelper.openUrlInNewTab).toHaveBeenCalledWith(component.link);
  });
});
