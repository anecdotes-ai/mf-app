import { HttpClient } from '@angular/common/http';
import { AbstractService } from 'core/modules/auth-core/services';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditorsPortalService extends AbstractService {

  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  }


  getTenants(): Observable<string[]> {
    return this.http.get<string[]>(this.buildUrl(e => e.auditorTenants));
  }

  exchangeToken(tenantSubdomain: string): Observable<string> {
    return this.http.get<string>(this.buildUrl(e => e.auditorTenantExchange, { tenant_subdomain: tenantSubdomain }));
  }
}
