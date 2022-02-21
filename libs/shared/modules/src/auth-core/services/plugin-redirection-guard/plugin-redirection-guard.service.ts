import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { PluginOauthHandlerService } from '../plugin-oauth-handler/plugin-oauth-handler.service';

// TODO: To be removed when we migrate all customers to firebase
@Injectable()
export class PluginRedirectionGuardService implements CanActivate {
  constructor(private pluginOauthHandlerService: PluginOauthHandlerService) {}
  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (
      // check route. it should be plugin details page
      state.url.startsWith('/plugins/') &&
      // check wether it's new plugin oauth redirection
      this.pluginOauthHandlerService.isNewRedirection(state.root.queryParams)
    ) {
      this.pluginOauthHandlerService.handlePluginRedirection(state.root.queryParams);
      return false;
    }

    return true;
  }
}
