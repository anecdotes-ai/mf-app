import { TestBed } from '@angular/core/testing';
import { MessageBusService } from 'core';

import { TestControlUpdationService } from './test-control-updation.service';

describe('TestControlUpdationService', () => {
  let service: TestControlUpdationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestControlUpdationService, MessageBusService],
    });
    service = TestBed.inject(TestControlUpdationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
