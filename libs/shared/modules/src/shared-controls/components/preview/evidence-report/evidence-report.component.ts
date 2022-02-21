import { Component } from '@angular/core';
import { IntercomService } from 'core/services';

@Component({
  selector: 'app-evidence-report',
  templateUrl: './evidence-report.component.html',
  styleUrls: ['./evidence-report.component.scss'],
})
export class EvidenceReportComponent {
  constructor(private intercomService: IntercomService) {}

  openIntercom(): void {
    this.intercomService.showNewMessage();
  }

  buildTranslationKey(relativeKey: string): string {
    return `evidences.evidenceReport.${relativeKey}`;
  }
}
