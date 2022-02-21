import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CustomerService } from './customer.service';

describe('Service: Customer', () => {
  let service: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CustomerService],
    });
    service = TestBed.inject(CustomerService);
  });

  it('should be able to create service instance', () => {
    expect(service).toBeDefined();
  });
});
