import { RegularDateFormat } from 'core/constants/date';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-executive-report-header',
  templateUrl: './executive-report-header.component.html',
  styleUrls: ['./executive-report-header.component.scss'],
})
export class ExecutiveReportHeaderComponent {
  @Input()
  lastUpdateDate: Date;

  dateFormat = RegularDateFormat;

  buildTranslationKey(relativeKey: string): string {
    return `executiveReport.header.${relativeKey}`;
  }
}
