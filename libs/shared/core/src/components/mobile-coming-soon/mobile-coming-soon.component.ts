import { Component } from '@angular/core';
import { MobileAndNotSupportBrowserService } from 'core/services/mobile-and-not-support-browser/mobile-and-not-support-browser.service';

@Component({
  selector: 'app-mobile-coming-soon',
  templateUrl: './mobile-coming-soon.component.html',
  styleUrls: ['./mobile-coming-soon.component.scss'],
})
export class MobileComingSoonComponent {
  isMobileDisplay: boolean;

  constructor(private mobileViewHandler: MobileAndNotSupportBrowserService) {}

  ngOnInit(): void {
    this.isMobileDisplay = this.mobileViewHandler.isMobile?.allTypes();
  }

  buildTranslationKey(relativeKey: string): string {
    return `mobile.comingSoon.${relativeKey}`;
  }
}
