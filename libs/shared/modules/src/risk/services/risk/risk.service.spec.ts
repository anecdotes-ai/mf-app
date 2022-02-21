import { TestBed } from '@angular/core/testing';

import { RiskService } from './risk.service';
import { HttpClientModule } from '@angular/common/http';

describe('RiskService', () => {
  let service: RiskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [RiskService],
    });
    service = TestBed.inject(RiskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
