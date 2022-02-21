import { TestBed } from '@angular/core/testing';

import { PolicyService } from './policy.service';
import {HttpClientModule} from '@angular/common/http';

describe('PolicyService', () => {
  let service: PolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PolicyService]
    });
    service = TestBed.inject(PolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
