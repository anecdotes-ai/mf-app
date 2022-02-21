import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-risk-grid-header',
  templateUrl: './risk-grid-header.component.html',
  styleUrls: ['./risk-grid-header.component.scss']
})
export class RiskGridHeaderComponent {
  @HostBinding('class')
  private classes = 'risk-grid font-main font-bold text-sm text-navy-70 mr-10 py-3 px-6';

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.${relativeKey}`;
  }
}
