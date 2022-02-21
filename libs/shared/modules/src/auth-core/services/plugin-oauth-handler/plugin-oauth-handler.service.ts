import { Injectable } from '@angular/core';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';

export const stateKey = 'state';
export const origStateKey = 'origState';
export const redirectOriginKey = 'redirectOrigin';

@Injectable()
export class PluginOauthHandlerService {
  constructor(private windowHelperService: WindowHelperService) {}

  handlePluginRedirection(queryParams: { [key: string]: string }): void {
    queryParams = { ...queryParams };
    const stateString = queryParams[stateKey];
    const stateObject = JSON.parse(this.windowHelperService.getWindow().atob(stateString));
    queryParams[stateKey] = stateObject[origStateKey];
    const stringifiedQueryParams = Object.keys(queryParams)
      .filter((key) => queryParams[key])
      .map((key) => `${key}=${queryParams[key]}`)
      .join('&');

    const url = `${stateObject[redirectOriginKey]}${
      this.windowHelperService.getWindow().location.pathname
    }?${stringifiedQueryParams}`;
    this.windowHelperService.openUrl(url);
  }

  isNewRedirection(queryParams: { [key: string]: string }): boolean {
    if (stateKey in queryParams) {
      const stateValue = queryParams[stateKey];

      try {
        const json = this.windowHelperService.getWindow().atob(stateValue);
        const stateObject = JSON.parse(json);
        return redirectOriginKey in stateObject;
      } catch {
        return false;
      }
    }

    return false;
  }
}
