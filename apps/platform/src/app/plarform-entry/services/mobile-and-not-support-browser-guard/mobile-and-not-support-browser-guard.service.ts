import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { MobileAndNotSupportBrowserService } from 'core/services/mobile-and-not-support-browser/mobile-and-not-support-browser.service';

@Injectable({
  providedIn: 'root',
})
export class MobileAndNotSupportBrowserViewGuardService implements CanActivate {
  constructor(private mobileAndNotSupportBrowser: MobileAndNotSupportBrowserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.mobileAndNotSupportBrowser.initialize();
    if (this.mobileAndNotSupportBrowser.isMobile.allTypes() || !this.mobileAndNotSupportBrowser.isBrowserSupported) {
      this.router.navigate(['mobile-coming-soon']);
      return false;
    }
    return true;
  }
}
