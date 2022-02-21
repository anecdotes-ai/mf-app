import { UserEventService } from 'core/services/user-event/user-event.service';
import { TestBed } from '@angular/core/testing';

import { NavigationBarEventsTrackingService } from './navigation-bar-events-tracking.service';

describe('NavigationBarEventsTrackingService', () => {
  let service: NavigationBarEventsTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: UserEventService, useValue: {}}
      ]
    });
    service = TestBed.inject(NavigationBarEventsTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
