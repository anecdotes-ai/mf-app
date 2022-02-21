import { Component, Input } from '@angular/core';
import { Framework } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-report-secondary-header',
  templateUrl: './report-secondary-header.component.html',
  styleUrls: ['./report-secondary-header.component.scss'],
})
export class ReportSecondaryHeaderComponent {
  @Input()
  framework: Framework;

  @Input()
  applicableControlsCount: number;

  buildTranslationKey(key: string): string {
    return `frameworkReport.secondaryHeader.${key}`;
  }

  buildIconPath(frameworkId: string): string {
    return `frameworks/${frameworkId}`;
  }
}
