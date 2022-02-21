import { TestBed } from '@angular/core/testing';
import { AuthService } from 'core/modules/auth-core/services';
import { RoleService } from './role.service';

class AuthServiceMock {
  getUserAsync(): any {
    return Promise.resolve();
  }
}

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceMock,
        },
      ],
    });
    service = TestBed.inject(RoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
