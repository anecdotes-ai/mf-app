import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { SamlService } from './saml.service';

describe('SamlService', () => {
  let service: SamlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SamlService]
    });
    service = TestBed.inject(SamlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
