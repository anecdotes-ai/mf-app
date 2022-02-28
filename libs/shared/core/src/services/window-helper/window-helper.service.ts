import { Injectable } from '@angular/core';

@Injectable()
export class WindowHelperService {
  getWindow(): Window {
    return window;
  }

  openUrlInNewTab(url: string): Window {
    return window.open(url, '_blank');
  }

  openUrl(url: string): Window {
    return window.open(url, '_self');
  }

  redirectToOrigin(): void {
    this.openUrl(window.location.origin);
  }
}
