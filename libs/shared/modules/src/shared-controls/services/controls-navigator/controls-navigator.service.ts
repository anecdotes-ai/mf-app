import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CalculatedControl } from 'core/modules/data/models';
import { AppRoutes } from 'core/constants';
import { ExploreControlsSource } from 'core/models';
import { ControlsFacadeService, FrameworksFacadeService, FrameworksEventService } from 'core/modules/data/services';
import { take } from 'rxjs/operators';
import { ControlsFocusingService } from '../controls-focusing/controls-focusing.service';

@Injectable()
export class ControlsNavigator {
  constructor(
    private router: Router,
    private controlsFocusingService: ControlsFocusingService,
    private frameworkFacade: FrameworksFacadeService,
    private controlsFacade: ControlsFacadeService,
    private frameworksEventService: FrameworksEventService
  ) {}

  async navigateToControlsPageAsync(
    framework_id: string,
    filter?: { [key: string]: any },
    source?: ExploreControlsSource,
    shouldSendEvent = true,
    state:{ [key: string]: any } = {}
  ): Promise<void> {
    filter = filter ?? {};
    const framework = await this.frameworkFacade.getFrameworkById(framework_id).pipe(take(1)).toPromise();

    if (shouldSendEvent) {
      this.frameworksEventService.trackExploreControlsClick(framework.framework_name, source);
    }

    await this.router.navigate([AppRoutes.Controls.replace(':framework', framework.framework_name)], {
      ...state,
      queryParams: {
        ...filter,
      },
    });
  }

  async navigateToControlsAuditPageAsync(framework_id: string, snapshot_id: string, source?: ExploreControlsSource): Promise<void> {
      const framework = await this.frameworkFacade.getFrameworkById(framework_id).pipe(take(1)).toPromise();

    this.frameworksEventService.trackExploreControlsClick(framework.framework_name, source);

    await this.router.navigate([`${AppRoutes.Controls.replace(':framework', framework.framework_name)}/${AppRoutes.ControlsFrameworkSnapshot.replace(':snapshot', snapshot_id)}`]);
  }

  async navigateToControlAsync(controlId: string): Promise<void> {
    this.controlsFocusingService.focusControl(controlId);
    await this.navigateToControlsIncludingNotApplicableControlsAsync(controlId);
  }

  async navigateToRequirementAsync(controlId: string, requirementId: string): Promise<void> {
    this.controlsFocusingService.focusRequirement(controlId, requirementId);
    await this.navigateToControlsIncludingNotApplicableControlsAsync(controlId);
  }

  async navigateToEvidenceAsync(controlId: string, evidenceId: string): Promise<void> {
    this.controlsFocusingService.focusEvidence(controlId, evidenceId);
    await this.navigateToControlsIncludingNotApplicableControlsAsync(controlId);
  }

  private getControlAsync(controlId: string): Promise<CalculatedControl> {
    return this.controlsFacade.getControl(controlId).pipe(take(1)).toPromise();
  }

  private async navigateToControlsIncludingNotApplicableControlsAsync(controlId: string): Promise<void> {
    const control = await this.getControlAsync(controlId);
    await this.navigateToControlsPageAsync(control.control_framework_id, {
      includeNotApplicable: control.control_is_applicable ? 'yes' : 'no',
    }, undefined, false);
  }
}
