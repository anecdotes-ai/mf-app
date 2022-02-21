import { Router } from '@angular/router';
import { AgentsFacadeService } from './../../../../data/services/facades/agent-facade/agents-facade.service';
import { PluginConnectionFacadeService } from './../../../services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { PluginConnectionFormBuilderService } from './../../../services/plugin-connection-form-builder/plugin-connection-form-builder.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPluginConnectionFormsComponent } from './all-plugin-connection-forms.component';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';

describe('AllPluginConnectionFormsComponent', () => {
  let component: AllPluginConnectionFormsComponent;
  let fixture: ComponentFixture<AllPluginConnectionFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: PluginConnectionFormBuilderService, useValue: {} },
        { provide: PluginConnectionFacadeService, useValue: {} },
        { provide: AgentsFacadeService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: OnPremEventService, useValue: {} },
      ],
      declarations: [AllPluginConnectionFormsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPluginConnectionFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
