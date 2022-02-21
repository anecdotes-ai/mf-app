import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlsFacadeService } from 'core/modules/data/services';
import { map, shareReplay } from 'rxjs/operators';
import { isDateBeforeToday } from 'core/utils';
import { Framework } from 'core/modules/data/models/domain';
import { AppRoutes, WindowHelperService } from 'core';

@Component({
  selector: 'app-framework-controls-status',
  templateUrl: './framework-controls-status.component.html',
  styleUrls: ['./framework-controls-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkControlsStatus implements OnInit {
  @Input()
  framework: Framework;

  controls$: Observable<CalculatedControl[]>;

  constructor(
    private controlsFacade: ControlsFacadeService,
    private windowHelper: WindowHelperService
  ) {}

  ngOnInit(): void {
    this.controls$ = this.controlsFacade.getControlsByFrameworkId(this.framework.framework_id).pipe(
      shareReplay(),
      map((controls: CalculatedControl[]) =>
        controls.filter((control: CalculatedControl) => control.control_is_applicable !== false)
      )
    );
  }

  buildTranslationKey(key: string): string {
    return `frameworks.frameworkManager.overview.${key}`;
  }

  auditHasStarted(): boolean {
    return isDateBeforeToday(this.framework?.framework_current_audit?.audit_date);
  }

  generateReport(): void {
    this.windowHelper.openUrlInNewTab(`/${AppRoutes.FrameworkReport}?framework_id=${this.framework.framework_id}`);
  }
}
