import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { Framework } from 'core/modules/data/models/domain';
import { Observable, combineLatest } from 'rxjs';
import { FrameworkControlsPartitionComponent } from '../framework-controls-partition/framework-controls-partition.component';
import { SubscriptionDetacher, isDateBeforeToday } from 'core/utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent implements OnInit, OnDestroy {
  @ViewChildren('controlList')
  private componentsQueryList: QueryList<FrameworkControlsPartitionComponent>;
  private frameworkName$: Observable<string>;
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  displayedFrameworks: Framework[] = [];
  noApplicableControls$: Observable<boolean>;
  @Output()
  controlsLoaded = new EventEmitter();

  currentFramework: Framework;
  isAuditInProgress: boolean;

  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private frameworksFacade: FrameworksFacadeService
  ) {
  }
  
  ngOnInit(): void {
    this.frameworkName$ = this.route.paramMap.pipe(map(paramsMap => paramsMap.get('framework')));
    combineLatest([this.frameworkName$, this.frameworksFacade
      .getAllUsableAndApplicableFrameworks()])
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(async ([frameworkName, frameworks]) => {
        const framework = frameworks.find((x) => x.framework_name === frameworkName);
        if (framework) {
          await this.selectFramework(framework);
          this.isAuditInProgress = isDateBeforeToday(framework?.framework_current_audit?.audit_date);
        }
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  async selectFramework(framework: Framework): Promise<void> {
    const previousFramework = this.currentFramework;
    this.currentFramework = framework;

    // in case the selected framework has been updated
    if (previousFramework?.framework_id === this.currentFramework?.framework_id) {
      return;
    }

    if (!this.displayedFrameworks.some((f) => f.framework_id === framework.framework_id)) {
      this.displayedFrameworks = [framework];
      this.cd.detectChanges();
    }

    await this.componentsQueryList
      .toArray()
      .find((x) => x.framework.framework_id === this.currentFramework.framework_id)
      .focusAsync();
  }

  frameworkTrackBy(index: number, framework: Framework): string | number {
    if (framework) {
      return framework.framework_id;
    }
    return index;
  }

  handleControlsLoaded(): void {
    this.controlsLoaded.emit();
  }
}
