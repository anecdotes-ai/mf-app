import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'core/services/config/app.config.service';
import { Observable } from 'rxjs';
import { AbstractService } from '../abstract-http/abstract-service';
import { Tenant, ExchangeResponse } from '../../../models/domain';

@Injectable()
export class TenantService extends AbstractService {
  constructor(httpBackend: HttpBackend, configService: AppConfigService) {
    super(new HttpClient(httpBackend), configService);
  }

  getTenantBySubdomain(tenant_subdomain: string, user_email?: string): Observable<Tenant> {
    return this.http.get<Tenant>(
      this.buildUrl((a) => a.getTenant),
      {
        params: {
          tenant_subdomain,
        },
      }
    );
  }

  getTenantByUserEmail(user_email: string): Observable<Tenant> {
    return this.http.get<Tenant>(
      this.buildUrl((a) => a.getTenant),
      {
        params: {
          user_email,
        },
      }
    );
  }

  exchangeToken(tokenToExchage: string): Observable<ExchangeResponse> {
    return this.http.post<ExchangeResponse>(
      this.buildUrl((a) => a.exchange),
      null,
      {
        headers: {
          authorization: `Bearer ${tokenToExchage}`,
        },
      }
    );
  }

  sendSignInEmail(user_email: string, tenant_subdomain: string): Observable<any> {
    return this.http.post(
      this.buildUrl((a) => a.sendSignInEmail, { user_email, tenant_subdomain }),
      null
    );
  }

  forgotAccount(user_email: string): Observable<any> {
    return this.http.post(this.buildUrl((a) => a.forgotAccount), { email: user_email });
  }

  linkCredentials(user_email: string, provider_id: string, pending_token: string, tenant_id: string, id_token: string): Observable<string>{
    return this.http.post<string>(this.buildUrl((a) => a.linkCredential), {
      user_email, provider_id, pending_token, tenant_id, id_token
    });
  }
}
