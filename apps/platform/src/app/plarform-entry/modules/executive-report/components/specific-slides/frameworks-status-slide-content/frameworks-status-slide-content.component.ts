import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SubscriptionDetacher, flattenAndDistinctArrays } from 'core/utils';
import { ControlsProgressBarDefinition } from 'core';
import { CalculatedControl } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService, FrameworkService } from 'core/modules/data/services';
import { Observable } from 'rxjs';
import { getPercents } from 'core/utils/percentage.function';
import {
  FrameworksStatusSlideContentData
} from '../models/frameworks-status-slide-content.model';

@Component({
  selector: 'app-frameworks-status-slide-content',
  templateUrl: './frameworks-status-slide-content.component.html',
  styleUrls: ['./frameworks-status-slide-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrameworksStatusSlideContentComponent {
  @Input()
  data: FrameworksStatusSlideContentData;

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  constructor(public frameworkService: FrameworkService, private controlsFacade: ControlsFacadeService) {}

  getCompletedControlsPercentage(framework: Framework): string {
    let compliliantControlsCount: number;
    let applicableControlscount: number;

    this.getContols(framework.framework_id).subscribe((controls) => {
      compliliantControlsCount = controls.filter((control) => control.control_status.status === 'COMPLIANT').length;
      applicableControlscount = controls.filter((control) => control.control_is_applicable).length;
    });

    return getPercents(compliliantControlsCount, applicableControlscount);
  }

  buildTranslationKey(relativeKey: string): string {
    return `executiveReport.slide.frameworksStatus.${relativeKey}`;
  }

  getProgressBarDefinition(framework: Framework): { overallCount: number; pbDefinition: ControlsProgressBarDefinition; } {
    let compliliantControlsCount: number;
    let inProgressControlsCount: number;
    let notStartedControlsCount: number;

    this.getContols(framework.framework_id).subscribe((controls) => {
      compliliantControlsCount = controls.filter((control) => control.control_status.status === 'COMPLIANT').length;
      inProgressControlsCount = controls.filter((control) => control.control_status.status === 'IN_PROGRESS').length;
      notStartedControlsCount = controls.filter((control) => control.control_status.status === 'NOT_STARTED').length;
    });

    return {
      overallCount:
        compliliantControlsCount +
        inProgressControlsCount +
        notStartedControlsCount,
      pbDefinition: {
        comply: {
          count: compliliantControlsCount,
          cssClass: 'compliant',
        },
        issue: {
          count: inProgressControlsCount,
          cssClass: 'in-progress',
        },
        gap: {
          count: notStartedControlsCount,
          cssClass: 'not-started',
        },
      },
    };
  }

  getEvidenceAutomationCount(framework: Framework): number {
    let evidenceAutomation: number;

    this.getContols(framework.framework_id).subscribe((controls) => {
      const filteredControls = controls.filter(
        (control) => control.control_has_automated_evidence_collected && control.control_is_applicable
      );
      evidenceAutomation = flattenAndDistinctArrays(
        filteredControls.map((c) => c.control_collected_automated_applicable_evidence_ids)
      ).length ?? 0;
    });

    return evidenceAutomation ?? 0;
  }

  private getContols(framework_id): Observable<CalculatedControl[]> {
    return this.controlsFacade.getControlsByFrameworkId(framework_id).pipe(this.detacher.takeUntilDetach());
  }
}
