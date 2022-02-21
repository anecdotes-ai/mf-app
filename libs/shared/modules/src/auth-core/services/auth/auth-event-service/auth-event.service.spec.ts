import { TestBed } from '@angular/core/testing';

import { AuthEventService } from './auth-event.service';

describe('AuthEventService', () => {
  let service: AuthEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthEventService, useValue: {} }],
    });
    service = TestBed.inject(AuthEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
