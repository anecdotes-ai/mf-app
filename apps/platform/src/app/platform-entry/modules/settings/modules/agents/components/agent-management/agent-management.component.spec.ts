import { AgentModalService } from './../../services/agent-modals/agent-modals.service';
import { AgentsFacadeService } from 'core/modules/data/services/facades/agent-facade/agents-facade.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentManagementComponent } from './agent-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';

describe('AgentManagementComponent', () => {
  let component: AgentManagementComponent;
  let fixture: ComponentFixture<AgentManagementComponent>;
  let onPremEventService: OnPremEventService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: AgentsFacadeService, useValue: {} },
        { provide: AgentModalService, useValue: {} },
        { provide: OnPremEventService, useValue: {} },
      ],
      declarations: [AgentManagementComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentManagementComponent);
    component = fixture.componentInstance;

    onPremEventService = TestBed.inject(OnPremEventService);
    onPremEventService.trackTabNavigationEvent = jasmine.createSpy('trackTabNavigationEvent');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onPremEventService.trackTabNavigationEvent', () => {
    // Arrange
    // Act
    component.trackTabSelection('tab');

    // Assert
    expect(onPremEventService.trackTabNavigationEvent).toHaveBeenCalledWith('tab');
  });
});
