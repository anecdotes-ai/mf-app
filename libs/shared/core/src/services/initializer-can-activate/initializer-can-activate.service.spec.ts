/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { PusherConfigService } from 'core/services';
import { AuthService } from 'core/modules/auth-core/services';
import { InitializerCanActivateService } from './initializer-can-activate.service';

describe('Service: InitializerCanActivate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitializerCanActivateService, { provide: AuthService, useValue: {} }, { provide: PusherConfigService, useValue: {}}],
    });
  });

  it('should ...', inject([InitializerCanActivateService], (service: InitializerCanActivateService) => {
    expect(service).toBeTruthy();
  }));
});
