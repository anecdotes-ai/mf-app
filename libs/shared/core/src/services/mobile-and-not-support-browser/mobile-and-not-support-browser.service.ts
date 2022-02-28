import { Injectable } from '@angular/core';
import { WindowHelperService } from '../window-helper/window-helper.service';
import { AppConfigService } from 'core/services';
import { MobileTypes } from 'core/models/mobile-types';

@Injectable(
  // TODO: Must be removed. Currently cannot be removed since it breaks lots of tests
  {
    providedIn: 'root' 
  }
)
export class MobileAndNotSupportBrowserService {
  isMobile: MobileTypes;
  isBrowserSupported: boolean;
  browserNotSupportedLink: string;

  constructor(
    private windowHelper: WindowHelperService,
    private windowHelperService: WindowHelperService,
    private configService: AppConfigService
  ) {}

  initialize(): void {
    this.checkMobileDevice();

    if (!this.isMobile.allTypes()) {
      this.detectSupportedBrowser();
    }
  }

  checkMobileDevice(): void {
    const win = this.windowHelper.getWindow();
    this.isMobile = {
      Android: () => {
        return !!win.navigator.userAgent.match(/Android/i);
      },
      BlackBerry: () => {
        return !!win.navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: () => {
        return !!win.navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: () => {
        return !!win.navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: () => {
        return !!win.navigator.userAgent.match(/IEMobile/i);
      },
      allTypes: () => {
        return (
          this.isMobile.Android() ||
          this.isMobile.BlackBerry() ||
          this.isMobile.iOS() ||
          this.isMobile.Opera() ||
          this.isMobile.Windows()
        );
      },
    };
  }

  detectSupportedBrowser(): void {
    const win = this.windowHelperService.getWindow();
    const agent = win.navigator.userAgent.toLowerCase();
    if (agent.match('edg') || agent.match('chrome')) {
      this.isBrowserSupported = true;
    }
    if (!this.isBrowserSupported) {
      this.browserNotSupportedLink = this.configService.config.redirectUrls.browserNotSupported;
      this.setLocationHref(this.browserNotSupportedLink);
    }
  }

  private setLocationHref(link: string): void {
    const win = this.windowHelperService.getWindow();
    win.location.href = link;
  }
}
