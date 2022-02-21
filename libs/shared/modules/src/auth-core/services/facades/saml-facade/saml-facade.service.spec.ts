import { AuthService } from 'core/modules/auth-core/services';
import { SamlService } from './../../http/saml/saml.service';
import { TestBed } from '@angular/core/testing';

import { SamlFacadeService } from './saml-facade.service';

describe('SamlFacadeService', () => {
  let service: SamlFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SamlService, useValue: {} },
        { provide: AuthService, useValue: {} },
        SamlFacadeService
      ]
    });
    service = TestBed.inject(SamlFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
