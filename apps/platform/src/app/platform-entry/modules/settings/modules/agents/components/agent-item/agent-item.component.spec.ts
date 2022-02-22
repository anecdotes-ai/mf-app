import { AgentModalService } from './../../services/agent-modals/agent-modals.service';
import { AgentsFacadeService } from 'core/modules/data/services/facades/agent-facade/agents-facade.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentItemComponent } from './agent-item.component';

describe('AgentsItemComponent', () => {
  let component: AgentItemComponent;
  let fixture: ComponentFixture<AgentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentItemComponent],
      providers: [
        { provide: AgentModalService, useValue: {} },
        { provide: AgentsFacadeService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
