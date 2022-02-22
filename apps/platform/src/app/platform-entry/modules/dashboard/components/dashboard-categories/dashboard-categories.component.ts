import { BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { ExploreControlsSource, MediaQueryService } from 'core';
import { CalculatedControl } from 'core/modules/data/models';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CategoryCollectedData } from '../../models';
import { Category, CategoryProgressStatus } from '../../models/category';
import { ButtonProgressCoverage } from '../../models/progress-coverage';
import { DashboardCategoriesResolverService } from '../../services';
import { Framework } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-dashboard-categories',
  templateUrl: './dashboard-categories.component.html',
  styleUrls: ['./dashboard-categories.component.scss'],
})
export class DashboardCategoriesComponent implements OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private dataChangeSubject = new BehaviorSubject<CalculatedControl[]>(null);
  private frameworkChangeSubject = new BehaviorSubject<Framework>(null);

  @Input() data: CalculatedControl[];
  @Input() emptyState: boolean;

  @Input() framework: Framework;

  categories: Category[];
  showProgressStatus: boolean;
  categoryCollectedData: CategoryCollectedData[][] = [];

  // Responsive behave
  isTabletSize: Observable<BreakpointState>;

  constructor(
    public categoriesResolverService: DashboardCategoriesResolverService,
    private mediaQueryService: MediaQueryService,
    private controlsNavigator: ControlsNavigator
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      this.dataChangeSubject.next(this.data);
    }

    if ('framework' in changes) {
      this.frameworkChangeSubject.next(this.framework);
    }
  }

  ngOnInit(): void {
    // Window size
    this.isTabletSize = this.mediaQueryService.getTabletSize();

    combineLatest([this.dataChangeSubject, this.frameworkChangeSubject])
      .pipe(
        filter(([data, framework]) => !!(data && framework)),
        this.detacher.takeUntilDetach()
      )
      .subscribe(([data, framework]) => {
        this.categories = this.categoriesResolverService.groupInCategories(data, false, framework);
        this.categoriesResolverService.joinProgressToCategory(this.categories, framework.framework_id);
      });

    if (this.emptyState) {
      this.categories = this.categoriesResolverService.groupInCategories(this.data, false, this.framework);
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  getStatusProgress(statusIndicationData: number): string {
    let status: string;
    switch (true) {
      case statusIndicationData <= ButtonProgressCoverage.basic.maxValue:
        status = CategoryProgressStatus.BASIC;
        break;
      case statusIndicationData >= ButtonProgressCoverage.advanced.minValue &&
        statusIndicationData <= ButtonProgressCoverage.advanced.maxValue:
        status = CategoryProgressStatus.ADVANCED;
        break;
      case statusIndicationData >= ButtonProgressCoverage.superstar.minValue:
        status = CategoryProgressStatus.SUPERSTAR;
        break;
      default:
        break;
    }
    return status;
  }

  exploreControls(category: Category): void {
    this.controlsNavigator.navigateToControlsPageAsync(
      this.framework.framework_id,
      {
        categories: category.category_name,
      },
      ExploreControlsSource.Dashboard
    );
  }

  buildTranslationKey(relativeKey: string): string {
    return `dashboard.categories.${relativeKey}`;
  }
}
