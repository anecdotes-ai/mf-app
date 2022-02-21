import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tenant-disabled-error',
  templateUrl: './tenant-disabled-error.component.html',
  styleUrls: ['./tenant-disabled-error.component.scss']
})
export class TenantDisabledErrorComponent {
  buildTranslationKey(relativeKey: string): string {
    return `auth.tenantDisabledErrorPage.${relativeKey}`;
  }
}
