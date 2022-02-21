import { Injectable } from '@angular/core';
import { AppConfigService } from 'core/services/config/app.config.service';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';

@Injectable()
export class TenantSubDomainExtractorService {
  static TenantSubdomainVariable = '{{tenant_sub_domain}}';
  static LocationOriginVariable = '{{location_origin}}';
  static TenantRedirectUrlVariable = '{{tenant_redirect_url}}';
  static TenantSignInRedirectPathVariable = '{{tenant_sign_in_redirect_path}}';

  constructor(private windowHelper: WindowHelperService, private appConfig: AppConfigService) {}

  getCurrentTenantSubDomain(): string {
    const hostName = this.windowHelper.getWindow().location.hostname;
    const extractedDomain = hostName.substr(0, hostName.indexOf('.'));
    return this.replaceQueryParamPatterns(
      this.appConfig.config.auth.tenantSubDomainFormat.replace('{{tenant_sub_domain}}', extractedDomain)
    );
  }

  getTenantUrl(tenantSubDomain: string): string {
    const result = this.appConfig.config.auth.tenantRedirectUrlFormat
      .replace(TenantSubDomainExtractorService.TenantSubdomainVariable, tenantSubDomain)
      .replace(TenantSubDomainExtractorService.LocationOriginVariable, this.windowHelper.getWindow().location.origin);

    return this.replaceQueryParamPatterns(result);
  }

  getTenantSignInUrl(tenantSubDomain: string): string {
    if (!this.appConfig.config.auth.tenantSignInUrlFormat) {
      return this.getTenantSignInPath(tenantSubDomain);
    }

    const result = this.appConfig.config.auth.tenantSignInUrlFormat
      .replace(TenantSubDomainExtractorService.TenantSubdomainVariable, tenantSubDomain)
      .replace(TenantSubDomainExtractorService.LocationOriginVariable, this.windowHelper.getWindow().location.origin)
      .replace(TenantSubDomainExtractorService.TenantRedirectUrlVariable, this.getTenantUrl(tenantSubDomain))
      .replace(
        TenantSubDomainExtractorService.TenantSignInRedirectPathVariable,
        this.getTenantSignInPath(tenantSubDomain)
      );

    return this.replaceQueryParamPatterns(result);
  }

  getCurrentTenantUrl(): string {
    return this.getTenantUrl(this.getCurrentTenantSubDomain());
  }

  private getTenantSignInPath(tenantSubDomain: string): string {
    return this.getTenantUrl(tenantSubDomain) + '/auth/sign-in';
  }

  private replaceQueryParamPatterns(template: string): string {
    const pattern = /\{\{queryParam\((?<name>\w+)\)\}\}/gm;
    const queryParamsObj = this.getQueryParamsObject();
    const matchesArray = Array.from(template.matchAll(pattern));

    return matchesArray.reduce(
      (result, match) => result.replace(match[0], queryParamsObj[match.groups.name]),
      template
    );
  }

  private getQueryParamsObject(): { [key: string]: string } {
    const search = this.windowHelper.getWindow().location.search?.substring(1);

    if (!search) {
      return {};
    }

    // https://stackoverflow.com/questions/8648892/how-to-convert-url-parameters-to-a-javascript-object
    return JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
      return key === '' ? value : decodeURIComponent(value);
    });
  }
}
