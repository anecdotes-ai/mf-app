import { Injectable } from '@angular/core';
import { TenantSubDomainExtractorService } from 'core/modules/auth-core/services';

@Injectable()
export class OAuthUrlHandlerService {
  private static stateRegex = /(state=)(?<stateValue>\w+)(&?)/i;

  constructor(private tenantSubDomainExtractor: TenantSubDomainExtractorService) {}

  modifyRedirectUri(urlToReplaceStateIn: string): string {
    const origState = urlToReplaceStateIn.match(OAuthUrlHandlerService.stateRegex)?.groups['stateValue'];
    const modifiedState = this.buildModifiedState(origState);

    if (origState) {
      const modifiedRedirectUri = urlToReplaceStateIn.replace(
        OAuthUrlHandlerService.stateRegex,
        `$1${modifiedState}$3`
      );
      return modifiedRedirectUri;
    }

    return urlToReplaceStateIn + `&state=${modifiedState}`;
  }

  private buildModifiedState(origState: string): string {
    const modifiedState = {
      redirectOrigin: this.tenantSubDomainExtractor.getCurrentTenantUrl(),
    };

    if (origState) {
      modifiedState['origState'] = origState;
    }

    return window.btoa(JSON.stringify(modifiedState));
  }
}
