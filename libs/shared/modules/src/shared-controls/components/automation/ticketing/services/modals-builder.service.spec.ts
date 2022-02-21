import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { TestBed } from '@angular/core/testing';

import { ModalsBuilderService } from './modals-builder.service';

describe('ModalsBuilderService', () => {
  let service: ModalsBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MessageBusService, useValue: {} }
      ]
    });
    service = TestBed.inject(ModalsBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
