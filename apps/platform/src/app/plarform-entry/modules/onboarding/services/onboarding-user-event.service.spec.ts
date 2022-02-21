import { TestBed } from '@angular/core/testing';
import { UserEventService } from 'core/services/user-event/user-event.service';

import { OnboardingUserEventService } from './onboarding-user-event.service';

describe('OnboardingUserEventService', () => {
  let service: OnboardingUserEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserEventService, useValue: {} },
      ],
    });
    service = TestBed.inject(OnboardingUserEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
