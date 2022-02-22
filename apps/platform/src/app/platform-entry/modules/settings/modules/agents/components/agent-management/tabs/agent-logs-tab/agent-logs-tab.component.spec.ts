import { AgentsFacadeService } from 'core/modules/data/services/facades/agent-facade/agents-facade.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLogsTabComponent } from './agent-logs-tab.component';

describe('AgentLogsTabComponent', () => {
  let component: AgentLogsTabComponent;
  let fixture: ComponentFixture<AgentLogsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentLogsTabComponent],
      providers: [{ provide: AgentsFacadeService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLogsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
