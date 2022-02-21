import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Tenant } from 'core/modules/auth-core/models/domain';
import { TenantFacadeService } from 'core/modules/auth-core/services';

@Component({
  selector: 'app-tenant-logo',
  templateUrl: './tenant-logo.component.html',
  styleUrls: ['./tenant-logo.component.scss'],
})
export class TenantLogoComponent implements OnInit {
  currentTenant$: Promise<Tenant>;

  constructor(private tenantFacade: TenantFacadeService, private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.currentTenant$ = this.tenantFacade.getCurrentTenantAsync();
  }

  sanitizeUrl(urlToSanitize: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(urlToSanitize);
  }
}
