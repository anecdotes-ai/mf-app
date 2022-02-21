import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Customer } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-report-primary-header',
  templateUrl: './report-primary-header.component.html',
  styleUrls: ['./report-primary-header.component.scss'],
})
export class ReportPrimaryHeaderComponent implements OnChanges {
  @Input()
  customer: Customer;

  reportDate = new Date();

  companyName: string;

  ngOnChanges(changes: SimpleChanges): void {
    if ('customer' in changes) {
      this.companyName = this.resolveCompanyName();
    }
  }

  buildTranslationKey(key: string): string {
    return `frameworkReport.primaryHeader.${key}`;
  }

  resolveCompanyName(): string {
    return this.customer?.customer_name ?? '...';
  }
}
