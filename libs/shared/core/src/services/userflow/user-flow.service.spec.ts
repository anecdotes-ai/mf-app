/* tslint:disable:no-unused-variable */
import { inject, TestBed } from '@angular/core/testing';
import { 
  AuthService, 
  TenantSubDomainExtractorService, 
  RoleService,
} from 'core/modules/auth-core/services';
import { AppConfigService } from '../config/app.config.service';
import { UserProviderService } from './../auth/user-provider/user-provider.service';
import { UserFlowService } from './user-flow.service';

describe('Service: UserFlow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserFlowService,
        { provide: AppConfigService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: UserProviderService, useValue: {} },
        { provide: TenantSubDomainExtractorService, useValue: {} },
        { provide: RoleService, useValue: {} },
      ],
    });
  });

  it('should ...', inject([UserFlowService], (service: UserFlowService) => {
    expect(service).toBeTruthy();
  }));
});
