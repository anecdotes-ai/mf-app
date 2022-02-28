import { WindowHelperService } from 'core/services';
import { AppRoutes } from 'core/constants';
import { Injectable } from '@angular/core';
import {take} from 'rxjs/operators';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { UserEvents, ControlEventDataProperty } from 'core/models/user-events/user-event-data.model';
import {ControlsFacadeService, FrameworksFacadeService} from 'core/modules/data/services';
import { Router } from '@angular/router';

@Injectable()
export class ControlsReportService {
  constructor(private windowService: WindowHelperService,
              private userEventService: UserEventService,
              private frameworksFacade: FrameworksFacadeService,
              private controlFacadeService: ControlsFacadeService,
              private router: Router)  {}

  async generateReport(control_ids: string[], frameworkId?: string): Promise<void>  {
    const controls = await this.controlFacadeService.getControlsById(control_ids).pipe(take(1)).toPromise();
    const framework = frameworkId ? await this.frameworksFacade.getFrameworkById(frameworkId).pipe(take(1)).toPromise() : undefined;
    this.userEventService.sendEvent(UserEvents.CONTROL_GENERATE_REPORT, {
      [ControlEventDataProperty.ControlCategory]: controls.map(c => c.control_category),
      [ControlEventDataProperty.FrameworkName]: framework?.framework_name || controls[0].control_framework,
      [ControlEventDataProperty.ControlName]: controls.map(c => c.control_name),
      [ControlEventDataProperty.ControlsCount]: control_ids.length,
      [ControlEventDataProperty.ControlStatus]: controls.map(c=>  c.control_status.status),
    });
    const urlPart = this.router.serializeUrl(
      this.router.createUrlTree([`/${AppRoutes.ControlsReport}`], { queryParams: { ['control_ids']: JSON.stringify(control_ids) } })
    );
    
    this.windowService.openUrlInNewTab(`${location.origin}${urlPart}`);
  }

  generateReportByFrameworkId(framework_id: string): void {
    // TODO
  }
}
