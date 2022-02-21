import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { ControlStatusEnum } from 'core/modules/data/models/domain';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlsFacadeService } from 'core/modules/data/services';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-framework-progress-bar',
  templateUrl: './framework-progress-bar.component.html',
  styleUrls: ['./framework-progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkProgressBarComponent implements OnInit {
  @HostBinding('class')
  private classes = 'flex flex-column';

  @Input()
  frameworkId: string;
  @Input()
  isAuditInProgress: boolean;

  @Input()
  fontSize: 'small' | 'large' = 'small';

  controls$: Observable<CalculatedControl[]>;
  percent$: Observable<number>;

  constructor(
    private controlsFacade: ControlsFacadeService,
  ) {}

  ngOnInit(): void {
    this.controls$ = this.controlsFacade.getControlsByFrameworkId(this.frameworkId).pipe(
      shareReplay(),
      map((controls: CalculatedControl[]) => controls.filter(
        (control: CalculatedControl) => control.control_is_applicable !== false
      ))
    );

    this.percent$ = this.controls$.pipe(map((controls) => this.getPercent(this.isAuditInProgress, controls)));
  }

  buildTranslationKey(relativeKey: string): string {
    return `frameworks.progress.${relativeKey}`;
  }

  private getPercent(isAuditStarted: boolean, allControls: CalculatedControl[]): number {
    let filtered: CalculatedControl[];

    if (isAuditStarted) {
      filtered = allControls.filter(
        (control) => control.control_status.status === ControlStatusEnum.APPROVED_BY_AUDITOR
      );
    } else {
      filtered = allControls.filter((control) => control.control_status.status === ControlStatusEnum.READY_FOR_AUDIT);
    }

    return Math.round((filtered.length / allControls.length) * 100);
  }
}
