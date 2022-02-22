import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { setDefaultLanguage } from 'core';

@Injectable({
  providedIn: 'root',
})
export class TranslateResolverService implements CanActivate {
  constructor(private injector: Injector) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    setDefaultLanguage(this.injector);
    return true;
  }
}
