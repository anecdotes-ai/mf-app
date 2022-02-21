import { Component, Input } from '@angular/core';
import { CalculatedControl } from 'core/modules/data/models';

@Component({
  selector: 'app-report-control',
  templateUrl: './report-control.component.html',
  styleUrls: ['./report-control.component.scss'],
})
export class ReportControlComponent {
  @Input()
  control: CalculatedControl;

  rowTrackBy(controlInstance: CalculatedControl): string {
    return controlInstance?.control_id;
  }

  buildTranslationKey(key: string): string {
    return `frameworkReport.reportControl.${key}`;
  }
}
