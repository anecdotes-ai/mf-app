import { Injectable } from '@angular/core';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, shareReplay, take, tap } from 'rxjs/operators';
import { ExchangeResponse, Tenant } from '../../../models/domain';
import { TenantService } from '../../http';
import { TenantSubDomainExtractorService } from '../../tenant-sub-domain-extractor/tenant-sub-domain-extractor.service';

@Injectable()
export class TenantFacadeService {
  private bySubdomainCache: { [subdomain: string]: Tenant } = {};

  constructor(
    private tenantService: TenantService,
    private tenantIdExtractorService: TenantSubDomainExtractorService,
    private windowHelper: WindowHelperService
  ) {}

  getCurrentTenantAsync(): Promise<Tenant> {
    return this.getTenantBySubdomain(this.tenantIdExtractorService.getCurrentTenantSubDomain()).pipe(take(1)).toPromise();
  }

  getTenantByEmail(user_email: string): Observable<Tenant> {
    return this.tenantService.getTenantByUserEmail(user_email);
  }

  doesTenantExist(tenantSubDomain: string): Observable<boolean> {
    return this.getTenantBySubdomain(tenantSubDomain).pipe(
      mapTo(true),
      catchError((error) => {
          // the subdomain is exists but disabled -> redirect to the subdomain
          if(error.error.error_detail === "tenant disabled"){
            return of(true);
          } else {
            return of(false);
          }
      }),
      shareReplay()
    );
  }

  exchangeTokenAsync(jwtTokenToExchage: string): Promise<ExchangeResponse> {
    return this.tenantService.exchangeToken(jwtTokenToExchage).pipe(take(1)).toPromise();
  }

  redirectToTenant(tenantSubDomain: string): void {
    this.windowHelper.openUrl(this.tenantIdExtractorService.getTenantUrl(tenantSubDomain));
  }

  redirectToTenantSignIn(tenantSubDomain: string, queryParams?: { [param: string]: any }): void {
    let tenantUrl = this.tenantIdExtractorService.getTenantSignInUrl(tenantSubDomain);

    if (queryParams) {
      const queryParamsString = `${Object.keys(queryParams)
        .map((key) => `${key}=${queryParams[key]}`)
        .join('&')}`;

      if (tenantUrl.search('\\?') >= 0) {
        tenantUrl = `${tenantUrl}&${queryParamsString}`; // for cases when tenant url already has query params
      } else {
        tenantUrl = `${tenantUrl}?${queryParamsString}`; // for cases when tenant url does not have query params
      }
    }

    this.windowHelper.openUrl(tenantUrl);
  }

  sendSignInEmailAsync(email: string, tenant_subdomain: string): Promise<void> {
    return this.tenantService.sendSignInEmail(email, tenant_subdomain).pipe(take(1)).toPromise();
  }

  linkCredentialsAndGetSignInLink(user_email: string, tenant_id: string, credentials: object): Promise<string>{
    const id_token = credentials['oauthIdToken'];
    const provider_id = credentials['providerId'];
    const pending_token = credentials['pendingToken'];
    return this.tenantService.linkCredentials(user_email, provider_id, pending_token, tenant_id, id_token).pipe(
      take(1)).toPromise();
  }

  getTenantBySubdomain(tenantSubDomain: string): Observable<Tenant> {
    if (tenantSubDomain in this.bySubdomainCache) {
      return of(this.bySubdomainCache[tenantSubDomain]);
    }

    return this.tenantService
      .getTenantBySubdomain(tenantSubDomain)
      .pipe(tap((tenant) => (this.bySubdomainCache[tenantSubDomain] = tenant)));
  }
}
