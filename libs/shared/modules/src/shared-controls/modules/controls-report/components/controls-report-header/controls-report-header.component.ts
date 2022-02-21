import { Customer } from 'core/modules/data/models/domain';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-controls-report-header',
  templateUrl: './controls-report-header.component.html',
  styleUrls: ['./controls-report-header.component.scss'],
})
export class ControlsReportHeaderComponent {
  readonly reportGenerateDate = new Date();

  @Input()
  customer: Customer;

  buildTranslationKey(key: string): string {
    return `controls.report.header.${key}`;
  }
}
