import { IntercomService } from 'core/services/intercom/intercom.service';
import { ModalWindowService } from 'core/modules/modals/services/modal-window/modal-window.service';
import { TestBed } from '@angular/core/testing';

import { AgentModalService } from './agent-modals.service';

describe('AgentModalsService', () => {
  let service: AgentModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AgentModalService,
        { provide: ModalWindowService, useValue: {} },
        { provide: IntercomService, useValue: {} },
      ],
    });
    service = TestBed.inject(AgentModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
