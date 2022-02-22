import { Component, OnInit } from '@angular/core';
import { AuthService, TenantSubDomainExtractorService } from 'core/modules/auth-core/services';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuditorsPortalService } from '../../services/auditors-zone-service/auditors-portal.service';

@Component({
  selector: 'app-auditors-portal',
  templateUrl: './auditors-portal.component.html',
  styleUrls: ['./auditors-portal.component.scss']
})
export class AuditorsPortalComponent implements OnInit {

  auditorName$: Observable<string>;
  availableTenants$: Observable<string[]>;

  constructor(private authService: AuthService, private auditorsPortalService: AuditorsPortalService,
    private tenantSubDomainExtractorService: TenantSubDomainExtractorService) { }

  ngOnInit(): void {
    this.auditorName$ = this.authService.getUser().pipe(
      take(1),
      map(user => user.name)
    );

    this.availableTenants$ = this.auditorsPortalService.getTenants().pipe(
      map(r => r.sort((a, b) => a > b ? 1 : -1))
    );
  }

  tenantExchange(tenantSubdomain: string): void {
    const tenantUrl = this.tenantSubDomainExtractorService.getTenantSignInUrl(tenantSubdomain).replace('/auth/sign-in', '/auth/token-callback');
    this.auditorsPortalService.exchangeToken(tenantSubdomain).subscribe(
      token => window.location.href = tenantUrl.includes('?') ? `${tenantUrl}&token=${token}` : `${tenantUrl}?token=${token}`
    );
  }

  async logOut(): Promise<void> {
    await this.authService.signOutAsync();
  }

}
