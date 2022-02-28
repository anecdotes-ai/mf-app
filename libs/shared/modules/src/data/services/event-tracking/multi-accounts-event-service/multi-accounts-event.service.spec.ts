import { TestBed } from '@angular/core/testing';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { MultiAccountsEventService } from './multi-accounts-event.service';

describe('MultiAccountsEventService', () => {
  let service: MultiAccountsEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserEventService, useValue: {} }
      ]
    });
    service = TestBed.inject(MultiAccountsEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
