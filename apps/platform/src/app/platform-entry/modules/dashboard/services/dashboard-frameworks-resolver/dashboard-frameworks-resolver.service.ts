import { Injectable } from '@angular/core';
import { ControlStatusEnum } from 'core/modules/data/models/domain';
import { TabModel } from 'core/modules/dropdown-menu';
import { FrameworkService } from 'core/modules/data/services';
import { DashboardFrameworksSectionData } from '../../models';
import { FrameworkStatus } from 'core/modules/data/models';
import { ProgressCoverage } from '../../models';

@Injectable(
  // TODO: Must be removed. Currently cannot be removed since it breaks lots of tests
  {
    providedIn: 'root' 
  }
)
export class DashboardFrameworksResolverService {
  constructor(private frameworkService: FrameworkService) {}

  // Calculation:  applicable controls / #evidence collected (manual + automated )] in percent
  static getProgressFramework(completed: number, applicable_controls: number): number {
    return Math.round((completed / applicable_controls) * 100);
  }

  // Show frameworks in the tabs
  public getFrameworkTabs(data: DashboardFrameworksSectionData): TabModel[] {
    const tabData: TabModel[] = [];
    data.frameworksSectionItems
      .filter(
        (_frameworkSectionItem) =>
          _frameworkSectionItem.framework.is_applicable &&
          _frameworkSectionItem.framework.framework_status === FrameworkStatus.AVAILABLE
      )
      .forEach((frameworkSectionItem, index) => {
        const actionRequiredControlsData = frameworkSectionItem.relatedControls.filter(
          (control) =>
            control.control_is_applicable &&
            (control.control_status.status === ControlStatusEnum.INPROGRESS ||
              control.control_status.status === ControlStatusEnum.READY_FOR_AUDIT ||
              control.control_status.status === ControlStatusEnum.APPROVED_BY_AUDITOR)
        );

        const controlsInProgressAndCompiliant: number = frameworkSectionItem.relatedControls.filter(
          (control) => control.control_status.status === ControlStatusEnum.INPROGRESS || control.control_status.status === ControlStatusEnum.COMPLIANT
        ).length;

        const aplicableControls: number = frameworkSectionItem.relatedControls.filter(
          (control) => control.control_is_applicable
        ).length;

        const progress = DashboardFrameworksResolverService.getProgressFramework(controlsInProgressAndCompiliant, aplicableControls) ?? 0;

        tabData.push({
          translationKey: frameworkSectionItem.framework.framework_name,
          icon: this.frameworkService.getFrameworkIconLink(frameworkSectionItem.framework.framework_id, true),
          tabId: index,
          context: {
            framework: frameworkSectionItem.framework,
            actionRequiredControls: actionRequiredControlsData,
            categoriesControls: frameworkSectionItem.relatedControls,
          },
          progress: DashboardFrameworksResolverService.getProgressFramework(
                frameworkSectionItem.relatedControls.filter(
                  (control) =>
                    (control.control_is_applicable && control.control_status.status === ControlStatusEnum.INPROGRESS) ||
                    control.control_status.status === ControlStatusEnum.READY_FOR_AUDIT ||
                    control.control_status.status === ControlStatusEnum.APPROVED_BY_AUDITOR
                ).length,
                aplicableControls
              )
              ?? 0,
          progressColor: this.getProgressColor(progress),
        });
      });
    return tabData;
  }

  private getProgressColor(progress: number): string {
    switch (true) {
      case progress >= ProgressCoverage.basic.minValue && progress <= ProgressCoverage.basic.maxValue:
        // color pink
        return '#ff3499';
      case progress >= ProgressCoverage.advanced.minValue && progress <= ProgressCoverage.advanced.maxValue:
        // color orange
        return '#ffa84f';
      case progress >= ProgressCoverage.superstar.minValue:
        // color blue
        return '#00dce8';
    }
  }
}
