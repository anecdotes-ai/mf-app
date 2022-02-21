/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PluginRedirectionGuardService } from './plugin-redirection-guard.service';
import { PluginOauthHandlerService } from '../plugin-oauth-handler/plugin-oauth-handler.service';

describe('Service: PluginRedirectionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PluginRedirectionGuardService, { provide: PluginOauthHandlerService, useValue: {} }],
    });
  });

  it('should ...', inject([PluginRedirectionGuardService], (service: PluginRedirectionGuardService) => {
    expect(service).toBeTruthy();
  }));
});
