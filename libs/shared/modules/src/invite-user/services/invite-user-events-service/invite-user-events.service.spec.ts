import { UserEventService } from 'core/services/user-event/user-event.service';
import { TestBed } from '@angular/core/testing';

import { InviteUserEventsService } from './invite-user-events.service';

describe('InviteUserEventsService', () => {
  let service: InviteUserEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UserEventService, useValue: {} }],
    });
    service = TestBed.inject(InviteUserEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
