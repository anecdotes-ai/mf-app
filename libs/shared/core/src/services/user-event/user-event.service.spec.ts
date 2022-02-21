import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterExtensionService } from 'core/services/router-extension/router-extension.service';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';

import { UserEventService } from './user-event.service';

describe('UserEventService', () => {
  let service: UserEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [MessageBusService, RouterExtensionService],
    });
    service = TestBed.inject(UserEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
