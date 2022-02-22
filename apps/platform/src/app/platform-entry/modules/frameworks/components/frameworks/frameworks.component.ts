import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NewFramework } from 'core/modules/data/constants';
import { LoaderManagerService } from 'core';
import { Framework } from 'core/modules/data/models/domain';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FrameworkContentService } from '../../services';

@Component({
  selector: 'app-frameworks',
  templateUrl: './frameworks.component.html',
  styleUrls: ['./frameworks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworksComponent implements OnInit, OnDestroy, AfterViewInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChildren('framework')
  private frameworksQueryList: QueryList<any>;

  frameworksStream$: Observable<Framework[]>;
  applicableFrameworksStream$: Observable<Framework[]>;
  notApplicableFrameworksStream$: Observable<Framework[]>;

  constructor(private loaderManager: LoaderManagerService, private frameworksFacade: FrameworksFacadeService, private frameworkContent: FrameworkContentService) {}

  ngOnInit(): void {
    this.loaderManager.show();
    // we use framework content service instead of the facade here to include the new framework mock
    this.frameworksStream$ = this.frameworkContent.getDisplayedFrameworks();
    this.notApplicableFrameworksStream$ = this.frameworkContent.getNotApplicableFrameworks();
    this.applicableFrameworksStream$ = this.frameworksFacade.getApplicableFrameworks();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.loaderManager.hide();
  }

  ngAfterViewInit(): void {
    combineLatest([this.frameworksStream$, this.frameworksQueryList.changes])
      .pipe(take(1), this.detacher.takeUntilDetach())
      .subscribe(() => {
        this.loaderManager.hide();
      });

    this.frameworksQueryList.notifyOnChanges();
  }

  selectFrameworkId(framework: Framework): string {
    return framework.framework_id;
  }

  buildTranslationKey(key: string): string {
    return `frameworks.${key}`;
  }
}
